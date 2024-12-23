import PageWrapper from '@components/PageWrapper'

export default function ChecklistPage() {
  const dateToday = new Date().toLocaleDateString()

  return <PageWrapper title="Checklist">Today {dateToday}</PageWrapper>
}
