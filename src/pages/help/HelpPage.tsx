import { useState, useMemo } from "react"
import { useSearchParams } from "react-router-dom"
import { Search, ArrowLeft, Play, Lightbulb } from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"
import { helpCategories, featuredTopics, HelpTopic, HelpStep } from "@/data/helpData"

export default function HelpPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [search, setSearch] = useState("")
  const [selectedTopic, setSelectedTopic] = useState<HelpTopic | null>(null)

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
    setSelectedTopic(null)
  }

  const TopicCard = ({ topic, onClick }: { topic: HelpTopic; onClick: () => void }) => (
    <button onClick={onClick} className="text-left w-full">
      <div className="rounded-xl overflow-hidden border border-border/50 bg-card hover:bg-muted/30 transition-colors">
        <div className="aspect-video overflow-hidden border-b border-border/50">
          <img src="/tutorial-placeholder.png" alt="" className="w-full h-full object-cover" />
        </div>
        <div className="p-4 h-[88px] flex flex-col justify-start">
          <p className="text-sm font-semibold text-white mb-1 line-clamp-1">{topic.title}</p>
          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{topic.description}</p>
        </div>
      </div>
    </button>
  )

  const TutorialStep = ({ step }: { step: HelpStep }) => (
    <div className="flex gap-5">
      <div className="flex flex-col items-center flex-shrink-0">
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
          <span className="text-xs font-bold text-white">{step.step}</span>
        </div>
        <div className="w-px flex-1 bg-border/40 mt-3 min-h-[24px]" />
      </div>
      <div className="pb-10 flex-1 min-w-0">
        <h3 className="text-sm font-semibold text-white mb-2 leading-snug">{step.title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">{step.description}</p>
        {step.imageUrl && (
          <div className="aspect-video rounded-xl overflow-hidden border border-border/50 bg-muted/10 mb-4">
            <img src={step.imageUrl} alt={`Passo ${step.step}: ${step.title}`} className="w-full h-full object-cover" />
          </div>
        )}
        {step.tip && (
          <div className="flex gap-3 rounded-lg border border-border/50 bg-muted/20 px-4 py-3">
            <Lightbulb className="h-4 w-4 text-yellow-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground leading-relaxed">{step.tip}</p>
          </div>
        )}
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header + Search */}
      <div className="rounded-xl bg-muted/10 border border-border/50 p-10 text-center">
        <h1 className="text-2xl font-bold text-white mb-2">How can we help you?</h1>
        <p className="text-sm text-muted-foreground mb-6">
          Search articles, guides and answers to your questions.
        </p>
        <div className="relative max-w-xl mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search articles..."
            value={search}
            onChange={e => { setSearch(e.target.value); setSelectedTopic(null) }}
            className="pl-10 h-12 bg-card border-border/50 text-white placeholder:text-muted-foreground rounded-xl"
          />
        </div>
      </div>

      {/* Two-column layout */}
      <div className="flex gap-8 items-start">
        {/* Left sidebar — same components and style as main app sidebar */}
        <aside className="w-52 flex-shrink-0">
          <SidebarMenu className="space-y-3">
            {filteredCategories.map(cat => (
              <SidebarMenuItem key={cat.id}>
                <SidebarMenuButton
                  onClick={() => handleCategoryClick(cat.id)}
                  className={cn(
                    "h-12 px-6 font-medium cursor-pointer",
                    activeCategoryId === cat.id
                      ? "bg-primary text-white font-medium"
                      : "hover:bg-muted/60 transition-colors"
                  )}
                >
                  <span className="truncate">{cat.label}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </aside>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {!activeCategoryId ? (
            /* Home: Popular Topics */
            <div>
              <h2 className="text-lg font-semibold text-white mb-4">Popular Topics</h2>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                {featuredTopics.map(topic => (
                  <TopicCard
                    key={topic.id}
                    topic={topic}
                    onClick={() => {
                      const cat = helpCategories.find(c => c.topics.some(t => t.id === topic.id))
                      if (cat) {
                        setSearchParams({ category: cat.id })
                        setSelectedTopic(topic)
                      }
                    }}
                  />
                ))}
              </div>
            </div>
          ) : selectedTopic ? (
            /* Topic detail: video + text content */
            <div>
              <button
                onClick={() => setSelectedTopic(null)}
                className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-white transition-colors mb-5"
              >
                <ArrowLeft className="h-4 w-4" />
                {activeCategory?.label}
              </button>

              {/* Topic title + description */}
              <h2 className="text-2xl font-bold text-white mb-2">{selectedTopic.title}</h2>
              <p className="text-sm text-muted-foreground mb-8">{selectedTopic.description}</p>

              {selectedTopic.steps && selectedTopic.steps.length > 0 ? (
                /* Tutorial step-by-step */
                <div>
                  {selectedTopic.steps.map(step => (
                    <TutorialStep key={step.step} step={step} />
                  ))}
                </div>
              ) : (
                /* FAQ fallback */
                <>
                  <div className="aspect-video rounded-xl bg-muted/20 border border-border/50 overflow-hidden flex items-center justify-center mb-6">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-14 h-14 rounded-full bg-card border border-border/50 flex items-center justify-center">
                        <Play className="h-6 w-6 text-muted-foreground/50 ml-0.5" />
                      </div>
                      <p className="text-xs text-muted-foreground/50">Tutorial video</p>
                    </div>
                  </div>
                  <div className="space-y-6">
                    {selectedTopic.faqs.map((faq, i) => (
                      <div key={i}>
                        <h3 className="text-sm font-semibold text-white mb-2">{faq.question}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">{faq.answer}</p>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          ) : (
            /* Category: same grid as Popular Topics */
            <div>
              <h2 className="text-lg font-semibold text-white mb-4">
                {activeCategory?.label}
              </h2>
              {visibleTopics.length === 0 ? (
                <div className="text-center py-16 text-muted-foreground text-sm">
                  No topics found for "{search}".
                </div>
              ) : (
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                  {visibleTopics.map(topic => (
                    <TopicCard
                      key={topic.id}
                      topic={topic}
                      onClick={() => setSelectedTopic(topic)}
                    />
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
