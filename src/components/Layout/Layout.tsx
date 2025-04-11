import { v4 } from "uuid"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import { createContext, useState } from "react"

import {
  LayoutComponent,
  Header,
  LogoText,
  Nav,
  Main,
  Footer,
  StyledNavLink,
  LogoImage,
  ButtonContainer
} from "./styles"
import { JokeTextInterface, LayoutProps, NavLinkObj } from "./types"
import { navLinksData } from "./data"
import Logo from '../../assets/avatar.jpg'
import Button from "../Button/Button"


export const JokeContext = createContext<JokeTextInterface>({
  joke: undefined,
  error: undefined,
  isLoading: false,
  getJoke: () => { }
})

function Layout({ children }: LayoutProps) {
  const [joke, setJoke] = useState<string | undefined>(undefined);
  const [error, setError] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const JOKE_URL: string = 'https://official-joke-api.appspot.com/random_joke';

  const getJoke = async () => {
    setError(undefined)
    try {
      setIsLoading(true);
      const response = await axios.get(JOKE_URL)
      console.log(response.data);
      const data = response.data;
      setJoke(`${data.setup} - ${data.punchline}`)
    }
    catch (error: any) {
      console.log(error.message);
      setError(error.message)
    }
    finally {
      console.log('Результат получен');
      setIsLoading(false);
    }
  }

  const navigate = useNavigate();

  const goBack = () => {
    //при вызове функции navigate, если добавить в качестве атрибута -1,
    //тогда при выполнении функции нас всегда будет возвращать на предыдущую открытую страницу
    navigate(-1)
  }

  const navLinks = navLinksData.map((navLink: NavLinkObj) => {
    return (
      <StyledNavLink key={v4()} to={navLink.to} style={
        ({ isActive }) => ({ textDecoration: isActive ? 'underline' : 'none' })
      }>{navLink.linkName}</StyledNavLink>
    )
  })

  return (
    <JokeContext.Provider value={{ joke, error, isLoading, getJoke }}>
      <LayoutComponent>
        <Header>
          <Link to='/'>
            <LogoImage src={Logo} />
          </Link>
          <Nav>
            {/* NavLink - компонент библиотеки, который добавляет ссылку на 
          страницу по маршруту через prop to */}
            {navLinks}
          </Nav>
        </Header>
        <Main>{children}</Main>
        <Footer>
          <ButtonContainer>
            <Button name='<-' onClick={goBack} />
          </ButtonContainer>
          <LogoText>Company name</LogoText>
        </Footer>
      </LayoutComponent>
    </JokeContext.Provider>
  )
}

export default Layout