import { Button } from '@components/Button'
import PageWrapper from '@components/PageWrapper'
import Link from 'next/link'

export default function Home() {
  return (
    <PageWrapper title="Home">
      <p>
        Lorem ipsum dolor sit,&nbsp;
        <Link href="http://google.com">Click here</Link>
        &nbsp;amet consectetur adipisicing elit. Nulla cupiditate earum ullam
        dolorum rerum ex dicta veniam sapiente eveniet ducimus inventore&nbsp;
        <Link href="http://google.com">Link to somewhere</Link>
        &nbsp;voluptatibus debitis ratione, molestiae quisquam nostrum modi
        fugit? Placeat?
      </p>

      <div className="pt-10 flex gap-2">
        <Button color="red">Red</Button>
        <Button color="orange">Orange</Button>
        <Button color="yellow">Yellow</Button>
        <Button color="green">Green</Button>
        <Button color="teal">Teal</Button>
        <Button color="blue">Blue</Button>
        <Button color="purple">Purple</Button>
        <Button color="pink">Pink</Button>
        <Button color="black">Black</Button>
      </div>
    </PageWrapper>
  )
}
