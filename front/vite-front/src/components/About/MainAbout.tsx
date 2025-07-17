import { Link } from 'react-router-dom';
import './MainAbout.css';

const MainAbout = () => {
    return (
        <>
            <main>
                <div className="contenedor-main-about">
                    <h2>Aboute Me</h2>
                    <hr className="linea-titulo" />

                    <section class="about-info" id="about-info">
                        <div class="caja-info-about">
                            <article class="presentacion">
                                <p>
                                    ¡Hola! Mi nombre Nahuel Banco, vivo en Santiago del estero, Argentina. Soy un programador junior apasionado por la tecnología y el desarrollo de
                                    software. Aunque estoy dando mis primeros pasos en el mundo laboral, mi entusiasmo y dedicación me han permitido adquirir conocimientos sólidos
                                    en diversas áreas de la programación.
                                </p>
                            </article>

                            <article class="formacion">
                                <h3>Formación y Habilidades</h3>
                                <p>
                                    Me gradué en Programador Web Full Stack en Digital House en el año 2023, donde desarrollé una base sólida en lenguajes de programación como
                                    JavaScript, HTML, CSS, entre otras. Además, he complementado mi formación con cursos en línea y proyectos personales que me han permitido
                                    mejorar mis habilidades técnicas y aprender nuevas tecnologías.
                                    <br />
                                    Algunas de las herramientas y tecnologías con las que estoy familiarizado incluyen:
                                </p>
                                <ul>
                                    <li>Lenguajes de programación: JavaScript, HTML</li>
                                    <li>Frameworks y bibliotecas: React, Express, Node.js</li>
                                    <li>Desarrollo web: HTML, CSS, JavaScript</li>
                                    <li>Bases de datos: MySQL, MongoDB</li>
                                    <li>Control de versiones: Git, GitHub</li>
                                </ul>
                            </article>

                            <article class="contacto">
                                <h3>Contacto</h3>
                                <p>
                                    Si deseas saber más sobre mí, conocer todos los proyecto en los que participe o discutir oportunidades de colaboración, no dudes en contactarme
                                    a través de{' '}
                                    <Link to="https://www.google.com/intl/es-419/gmail/about/" target="_blank">
                                        {' '}
                                        banconahuel417@gmail.com{' '}
                                    </Link>{' '}
                                    o revisar mi perfil de o revisar mi perfil de{' '}
                                    <Link to="https://github.com/Nahuel417" target="_blank">
                                        {' '}
                                        GitHub.{' '}
                                    </Link>
                                </p>
                            </article>
                            <h3 class="despedida">¡Gracias por visitar mi página!</h3>
                        </div>
                    </section>
                </div>
            </main>
        </>
    );
};

export default MainAbout;
