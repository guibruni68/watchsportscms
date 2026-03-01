import { useState, useMemo } from "react"
import { useSearchParams } from "react-router-dom"
import { Search, ChevronRight } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion"
import { cn } from "@/lib/utils"
import { helpCategories, featuredTopics, HelpTopic } from "@/data/helpData"

export default function HelpPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [search, setSearch] = useState("")
  const [expandedTopic, setExpandedTopic] = useState<string | null>(null)

  const activeCategoryId = searchParams.get("category")
  const activeCategory = helpCategories.find(c => c.id === activeCategoryId)

  const filteredCategories = useMemo(() => {
    if (!search) return helpCategories
    const q = search.toLowerCase()
    return helpCategories.filter(c =>
      c.label.toLowerCase().includes(q) ||
      c.topics.some(t =>
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q)
      )
    )
  }, [search])

  const visibleTopics: HelpTopic[] = useMemo(() => {
    if (!activeCategory) return []
    if (!search) return activeCategory.topics
    const q = search.toLowerCase()
    return activeCategory.topics.filter(t =>
      t.title.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q)
    )
  }, [activeCategory, search])

  const handleCategoryClick = (id: string) => {
    setSearchParams(id === activeCategoryId ? {} : { category: id })
    setExpandedTopic(null)
  }

  return (
    <div className="space-y-6">
      {/* Header + Search */}
      <div className="rounded-xl bg-gradient-to-r from-[#1a1a1a] to-[#0d0d0d] border border-[#1f1f1f] p-10 text-center">
        <h1 className="text-2xl font-bold text-white mb-2">Como podemos ajudar?</h1>
        <p className="text-sm text-muted-foreground mb-6">
          Busque artigos, guias e respostas para as suas dúvidas.
        </p>
        <div className="relative max-w-xl mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar artigos..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-10 h-12 bg-[#0d0d0d] border-[#262626] text-white placeholder:text-muted-foreground rounded-xl"
          />
        </div>
      </div>

      {/* Two-column layout */}
      <div className="flex gap-6 items-start">
        {/* Left sidebar */}
        <aside className="w-56 flex-shrink-0">
          <Card className="border-[#1f1f1f] bg-[#0d0d0d] rounded-xl">
            <CardContent className="p-2">
              <nav className="space-y-0.5">
                {filteredCategories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryClick(cat.id)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors text-left",
                      activeCategoryId === cat.id
                        ? "bg-primary text-white font-medium"
                        : "text-muted-foreground hover:text-white hover:bg-muted/60"
                    )}
                  >
                    <cat.icon className="h-4 w-4 flex-shrink-0" />
                    <span>{cat.label}</span>
                    {activeCategoryId === cat.id && (
                      <ChevronRight className="h-3.5 w-3.5 ml-auto" />
                    )}
                  </button>
                ))}
              </nav>
            </CardContent>
          </Card>
        </aside>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {!activeCategoryId ? (
            /* Home: Popular Topics */
            <div>
              <h2 className="text-base font-semibold text-white mb-4">Tópicos Populares</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {featuredTopics.map(topic => (
                  <button
                    key={topic.id}
                    onClick={() => {
                      const cat = helpCategories.find(c => c.topics.some(t => t.id === topic.id))
                      if (cat) {
                        setSearchParams({ category: cat.id })
                        setExpandedTopic(topic.id)
                      }
                    }}
                    className="text-left"
                  >
                    <Card className="border-[#1f1f1f] bg-[#0d0d0d] hover:bg-[#141414] transition-colors rounded-xl h-full">
                      <CardContent className="p-5">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
                          <topic.icon className="h-6 w-6 text-primary" />
                        </div>
                        <p className="text-sm font-semibold text-white mb-1">{topic.title}</p>
                        <p className="text-xs text-muted-foreground leading-relaxed">{topic.description}</p>
                      </CardContent>
                    </Card>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* Category view: topic cards + accordion */
            <div>
              <h2 className="text-base font-semibold text-white mb-4">
                {activeCategory?.label}
              </h2>

              {visibleTopics.length === 0 ? (
                <div className="text-center py-16 text-muted-foreground text-sm">
                  Nenhum tópico encontrado para "{search}".
                </div>
              ) : (
                <div className="space-y-3">
                  {visibleTopics.map(topic => (
                    <Card
                      key={topic.id}
                      className={cn(
                        "border-[#1f1f1f] bg-[#0d0d0d] rounded-xl overflow-hidden transition-colors",
                        expandedTopic === topic.id && "border-primary/30"
                      )}
                    >
                      {/* Topic header */}
                      <button
                        className="w-full flex items-center gap-4 p-5 hover:bg-[#141414] transition-colors text-left"
                        onClick={() =>
                          setExpandedTopic(expandedTopic === topic.id ? null : topic.id)
                        }
                      >
                        <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                          <topic.icon className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-white">{topic.title}</p>
                          <p className="text-xs text-muted-foreground">{topic.description}</p>
                        </div>
                        <ChevronRight
                          className={cn(
                            "h-4 w-4 text-muted-foreground flex-shrink-0 transition-transform",
                            expandedTopic === topic.id && "rotate-90"
                          )}
                        />
                      </button>

                      {/* Accordion Q&A */}
                      {expandedTopic === topic.id && (
                        <div className="border-t border-[#1f1f1f] px-5 pb-2">
                          <Accordion type="single" collapsible className="w-full">
                            {topic.faqs.map((faq, i) => (
                              <AccordionItem
                                key={i}
                                value={`faq-${i}`}
                                className="border-[#262626]"
                              >
                                <AccordionTrigger className="text-sm text-white/80 hover:text-white py-4 text-left">
                                  {faq.question}
                                </AccordionTrigger>
                                <AccordionContent className="text-sm text-muted-foreground pb-4 leading-relaxed">
                                  {faq.answer}
                                </AccordionContent>
                              </AccordionItem>
                            ))}
                          </Accordion>
                        </div>
                      )}
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
