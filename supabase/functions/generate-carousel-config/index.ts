import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, availableTeams, availableCatalogues, availablePlayers, availableChampionships, availableBanners } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY not configured");
      throw new Error("LOVABLE_API_KEY não configurada");
    }

    console.log("Processing carousel config prompt:", prompt);
    console.log("Available data:", { 
      teams: availableTeams?.length || 0,
      catalogues: availableCatalogues?.length || 0,
      players: availablePlayers?.length || 0,
      championships: availableChampionships?.length || 0,
      banners: availableBanners?.length || 0
    });

    const systemPrompt = `Você é um assistente especializado em configurar carrosséis para um CMS de esportes.
Baseado no prompt do usuário, você deve retornar APENAS um objeto JSON válido com a configuração do carrossel.

Dados disponíveis:
- Times: ${JSON.stringify(availableTeams?.map((t: any) => ({ id: t.id, name: t.name })) || [])}
- Catálogos: ${JSON.stringify(availableCatalogues?.map((c: any) => ({ id: c.id, title: c.title })) || [])}
- Jogadores: ${JSON.stringify(availablePlayers?.map((p: any) => ({ id: p.id, name: p.name })) || [])}
- Campeonatos: ${JSON.stringify(availableChampionships?.map((ch: any) => ({ id: ch.id, name: ch.name })) || [])}
- Banners: ${JSON.stringify(availableBanners?.map((b: any) => ({ id: b.id, title: b.title })) || [])}

Layouts disponíveis:
- default: Carrossel padrão horizontal
- highlight: Destaque com item maior
- vertical: Carrossel vertical
- game_result: Resultados de jogos
- hero_banner: Banner hero grande

Tipos de carrossel:
- automatic: Seleção automática baseada em filtros
- manual: Seleção manual de itens
- personalized: Personalizado por usuário

Domínios (tipos de conteúdo):
- collection: Coleções gerais
- team: Times específicos
- catalogue: Catálogos
- player: Jogadores
- championship: Campeonatos
- banner: Banners

Tipos de ordenação:
- recent: Mais recentes
- oldest: Mais antigos
- mostWatched: Mais assistidos
- alphabetical: Alfabética

Tipos de plano:
- basic: Plano básico
- premium: Plano premium
- all: Todos os planos

IMPORTANTE: Retorne APENAS o objeto JSON, sem markdown, sem explicações, sem texto adicional.

Exemplo de resposta:
{
  "title": "Jogadores do Flamengo",
  "layout": "default",
  "carouselType": "automatic",
  "sortType": "recent",
  "contentLimit": 10,
  "planType": "basic",
  "status": true,
  "showMoreButton": true,
  "domain": "player",
  "domainValue": "team_id_do_flamengo",
  "explanation": "Carrossel configurado para mostrar jogadores do time Flamengo ordenados por mais recentes"
}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt }
        ],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Limite de requisições excedido. Tente novamente em alguns instantes." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Créditos insuficientes. Adicione créditos ao seu workspace Lovable." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("Erro ao processar requisição com AI");
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;
    
    console.log("AI raw response:", aiResponse);

    // Parse the JSON response
    let config;
    try {
      // Remove markdown code blocks if present
      const cleanResponse = aiResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      config = JSON.parse(cleanResponse);
      console.log("Parsed config:", config);
    } catch (e) {
      console.error("Failed to parse AI response:", e);
      throw new Error("Resposta da AI em formato inválido");
    }

    return new Response(JSON.stringify({ config }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in generate-carousel-config:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Erro desconhecido" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
