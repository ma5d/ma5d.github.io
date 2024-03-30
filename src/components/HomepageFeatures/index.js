import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: '快速使用',
    Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
    description: (
      <>
        Docusaurus从头开始设计，易于安装用于快速启动和运行您的网站。
      </>
    ),
  },
  {
    title: '专注于重要的事情',
    Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
    description: (
      <>
        Docusaurus让您专注于您的文档，而我们去做一些杂物。
        只需要您的文档移动到<code>docs</code>目录中。
      </>
    ),
  },
  {
    title: '由React提供动力',
    Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
    description: (
      <>
      通过重用React扩展或自定义您的网站布局。Docusaurus可以
      在重用相同页眉和页脚的同时进行扩展。
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
