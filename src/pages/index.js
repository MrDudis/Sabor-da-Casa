import Head from "next/head";

import HeroSection from "@/components/index/HeroSection";
import MenuSection from "@/components/index/MenuSection";
import ReviewsSection from "@/components/index/ReviewsSection";
import LocationSection from "@/components/index/LocationSection";
import ContactSection from "@/components/index/ContactSection";
import FooterSection from "@/components/index/FooterSection";

export function getStaticProps() {

    const reviews = [
        {
            author: "Camila Oliveira",
            rate: 5,
            description: "O Sabor da Casa é o melhor restaurante que já fui! A comida é deliciosa e o atendimento é excepcional. Recomendo o filé mignon ao molho madeira, é uma verdadeira delícia!"
        },
        {
            author: "Pedro Santos",
            rate: 5,
            description: "Fui ao Sabor da Casa com minha família e ficamos encantados! A comida é caseira e muito saborosa, parece que estamos em casa. Não deixe de experimentar o feijão tropeiro, é divino!"
        },
        {
            author: "Carolina Almeida",
            rate: 5,
            description: "O atendimento do Sabor da Casa é impecável. Todos os funcionários são simpáticos e atenciosos. A comida é ótima, principalmente a picanha grelhada, que é feita com muito capricho."
        },
        {
            author: "Rafael Silva",
            rate: 5,
            description: "O ambiente do Sabor da Casa é super agradável e acolhedor. A comida é excelente e os preços são muito justos. Adorei o frango à passarinho, simplesmente delicioso!"
        },
        {
            author: "Isabela Ribeiro",
            rate: 5,
            description: "Se você procura comida de qualidade e preço justo, vá ao Sabor da Casa. Os pratos são bem servidos e a comida é deliciosa. Não deixe de experimentar a moqueca de peixe, é incrível!"
        },
        {
            author: "Lucas Ferreira",
            rate: 5,
            description: "O Sabor da Casa é um restaurante perfeito para jantares em família. A comida é caseira e muito saborosa. Adorei o risoto de camarão, acompanhado de uma taça de vinho tinto."
        },
        {
            author: "Mariana Costa",
            rate: 5,
            description: "O Sabor da Casa é o meu restaurante favorito na cidade. Os pratos são muito bem feitos e o sabor é excepcional. Não deixe de experimentar o cheesecake de frutas vermelhas, é simplesmente divino!"
        },
        {
            author: "João Rodrigues",
            rate: 5,
            description: "O Sabor da Casa é um lugar especial. A comida é feita com ingredientes frescos e muito amor. Recomendo o picadinho de carne, acompanhado de arroz, feijão e farofa, é um prato que aquece a alma!"
        }
    ];

    return {
        props: {
            reviews
        }
    };

}

export default function Index({ reviews }) {

    return (
        <>

            <Head>
                <title>Restaurante | Sabor da Casa</title>
                <meta property="og:title" content="Restaurante | Sabor da Casa" key="title" />
                <meta name="og:description" content="O melhor restaurante da cidade, com comida caseira e muito sabor." />
                <meta name="theme-color" content="#ed3434"></meta>
            </Head>

            <HeroSection></HeroSection>

            <MenuSection></MenuSection>

            <ReviewsSection reviews={reviews}></ReviewsSection>

            <LocationSection></LocationSection>

            <ContactSection></ContactSection>

            <FooterSection></FooterSection>
            
        </>
    );

}