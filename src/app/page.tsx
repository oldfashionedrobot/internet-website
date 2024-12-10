import { Button } from '@components/Button'
import Link from 'next/link'

export default function Home() {
  return (
    <div>
      <hgroup className="p-10 leading-loose">
        <h1>Welcome to my house</h1>
        <Button className="black">What Up Nerds</Button>
      </hgroup>

      <p className="p-10 pt-0">
        Lorem ipsum dolor sit,&nbsp;
        <Link href="http://google.com">Click here</Link>
        &nbsp;amet consectetur adipisicing elit. Nulla cupiditate earum ullam
        dolorum rerum ex dicta veniam sapiente eveniet ducimus inventore&nbsp;
        <Link href="http://google.com">Link to somewhere</Link>
        &nbsp;voluptatibus debitis ratione, molestiae quisquam nostrum modi
        fugit? Placeat?
      </p>

      <Button className="bg-red">Red</Button>
      <Button className="!bg-green">Green</Button>
      <Button className="!bg-blue">Blue</Button>
      <Button className="!bg-cyan">Cyan</Button>
      <Button className="bg-magenta">Magenta</Button>
      <Button className="bg-yellow">Yellow</Button>
      <Button className="bg-purple">Purple</Button>
      <Button className="bg-orange">Orange</Button>
    </div>
  )
}
