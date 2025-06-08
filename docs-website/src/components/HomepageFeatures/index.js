import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: 'Direct aan de slag',
    Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
    description: (
      <>
        Onze gratis SIEM voor het MKB is direct inzetbaar, zonder ingewikkelde installatie. Cybersecurity eenvoudig en snel geregeld.
      </>
    ),
  },
  {
    title: 'Jij focust op je bedrijf, wij op de beveiliging',
    Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
    description: (
      <>
        Richt je op wat belangrijk is voor jouw onderneming. Wij zorgen voor de cyberveiligheid, zodat jij je geen zorgen hoeft te maken.
      </>
    ),
  },
  {
    title: 'Gebouwd op Wazuh – open, veilig en toekomstbestendig',
    Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
    description: (
      <>
        Profiteer van automatische updates, een actieve community en een betrouwbare open source basis.
      </>
    ),
  },
];

function Feature({Svg, title, description}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
