/**
 * Mentions légales et politique de confidentialité.
 * Références : loi n° 2010/021 du 21 décembre 2010 régissant le commerce électronique au Cameroun,
 * loi n° 2010/012 du 21 décembre 2010 relative à la cybersécurité et la cybercriminalité,
 * loi n° 2024/017 du 23 décembre 2024 relative à la protection des données à caractère personnel,
 * loi n° 2000/011 du 19 décembre 2000 relative au droit d'auteur et aux droits voisins,
 * et, pour les visiteurs résidant dans l'Union européenne, le règlement (UE) 2016/679 (RGPD).
 *
 * ⚠ Ces textes constituent une base sérieuse mais ne remplacent pas la relecture d'un juriste.
 */
import { site } from '../config/site';
import type { Locale } from '../i18n/locales';

export interface LegalSection {
  id: string;
  heading: string;
  paragraphs?: string[];
  list?: string[];
}

export interface LegalDocument {
  intro: string[];
  sections: LegalSection[];
  /** Mention de la version faisant foi (versions traduites). */
  prevails?: string;
}

const L = site.legal;
const address = (locale: Locale) =>
  `${site.address.landmark[locale]}, ${site.address.street}, ${site.address.city}, ${site.address.country[locale]}`;

const contactLine = (locale: Locale) => {
  const labels = {
    fr: ['Téléphone et WhatsApp', 'E-mail'],
    en: ['Phone and WhatsApp', 'Email'],
    ko: ['전화 및 WhatsApp', '이메일'],
    zh: ['电话及 WhatsApp', '电子邮件'],
  }[locale];
  const sep = { fr: '\u202f: ', en: ': ', ko: ': ', zh: '：' }[locale];
  return [`${labels[0]}${sep}${site.phone.display}`, ...(site.email ? [`${labels[1]}${sep}${site.email}`] : [])];
};

const WHATSAPP_PRIVACY = 'https://www.whatsapp.com/legal/privacy-policy';
const GOOGLE_PRIVACY = 'https://policies.google.com/privacy';
const CLOUDFLARE_PRIVACY = 'https://www.cloudflare.com/privacypolicy/';

/* ───────────────────────────── Mentions légales ───────────────────────────── */

export function legalNotice(locale: Locale): LegalDocument {
  switch (locale) {
    case 'fr':
      return {
        intro: [
          `Conformément à la loi n° 2010/021 du 21 décembre 2010 régissant le commerce électronique au Cameroun, les informations suivantes sont portées à la connaissance des utilisateurs du site ${site.url.replace('https://', '')}.`,
        ],
        sections: [
          {
            id: 'editeur',
            heading: 'Éditeur du site',
            paragraphs: [
              `Le site est édité par M. ${L.publisher}, personne physique, à titre non professionnel, pour le restaurant familial «\u00a0${site.fullName}\u00a0».`,
            ],
            list: [
              `Adresse de correspondance\u202f: ${address('fr')}`,
              ...contactLine('fr'),
              ...(L.restaurantRccm ? [`RCCM du restaurant\u202f: ${L.restaurantRccm}`] : []),
              ...(L.restaurantNiu ? [`NIU du restaurant\u202f: ${L.restaurantNiu}`] : []),
              `Directeur de la publication\u202f: M. ${L.publicationDirector}`,
            ],
          },
          {
            id: 'hebergement',
            heading: 'Hébergement',
            paragraphs: [`Le site est hébergé par ${L.host.name}, ${L.host.address} — ${L.host.url}.`],
          },
          {
            id: 'propriete',
            heading: 'Propriété intellectuelle',
            paragraphs: [
              'Les textes, logos, marques, photographies, illustrations et la mise en page de ce site sont protégés par la loi n° 2000/011 du 19 décembre 2000 relative au droit d’auteur et aux droits voisins ainsi que par l’Accord de Bangui (OAPI).',
              'Toute reproduction, représentation, adaptation ou diffusion, totale ou partielle, sans autorisation écrite préalable de l’éditeur est interdite, sauf dans les cas prévus par la loi.',
            ],
          },
          {
            id: 'visuels',
            heading: 'Visuels',
            paragraphs: [
              'Les photographies de plats présentées sur ce site sont des visuels d’illustration générés par intelligence artificielle ; elles ne sont pas contractuelles et la présentation des plats servis au restaurant peut différer. Le logo et la scène en trois dimensions de la page d’accueil sont des créations graphiques originales.',
            ],
          },
          {
            id: 'informations',
            heading: 'Carte, prix et horaires',
            paragraphs: [
              'Les prix sont indiqués en francs CFA (FCFA), toutes taxes comprises. La carte, les prix et les horaires sont mis à jour avec soin mais peuvent évoluer ; en cas de différence, les informations affichées au restaurant font foi.',
            ],
          },
          {
            id: 'reservations',
            heading: 'Demandes de réservation',
            paragraphs: [
              'Le formulaire du site prépare une demande de réservation envoyée par l’utilisateur via WhatsApp. Une demande ne vaut réservation qu’après confirmation expresse du restaurant.',
            ],
          },
          {
            id: 'liens',
            heading: 'Liens externes',
            paragraphs: [
              'Le site contient des liens vers des services tiers (Instagram, Facebook, Tripadvisor, WhatsApp, services de cartographie). L’éditeur n’exerce aucun contrôle sur ces services et décline toute responsabilité quant à leur contenu ou à leurs pratiques.',
            ],
          },
          {
            id: 'donnees',
            heading: 'Données personnelles',
            paragraphs: [
              'Le traitement de vos données personnelles est décrit dans notre politique de confidentialité, établie conformément à la loi n° 2024/017 du 23 décembre 2024 relative à la protection des données à caractère personnel au Cameroun.',
            ],
          },
          {
            id: 'droit',
            heading: 'Droit applicable',
            paragraphs: [
              'Le présent site est soumis au droit camerounais, notamment aux lois n° 2010/021 et n° 2010/012 du 21 décembre 2010. Sous réserve des dispositions impératives protégeant les consommateurs, tout litige relève de la compétence des juridictions de Douala.',
              'Le site est proposé en français, en anglais, en coréen et en chinois. En cas de divergence entre les versions, la version française prévaut.',
            ],
          },
        ],
      };

    case 'en':
      return {
        intro: [
          `In accordance with Cameroonian Law No. 2010/021 of 21 December 2010 governing electronic commerce, the following information is provided to users of ${site.url.replace('https://', '')}.`,
        ],
        sections: [
          {
            id: 'publisher',
            heading: 'Website publisher',
            paragraphs: [
              `This website is published by Mr ${L.publisher}, a private individual acting in a non-professional capacity, for the family-run restaurant “${site.fullName}”.`,
            ],
            list: [
              `Correspondence address: ${address('en')}`,
              ...contactLine('en'),
              ...(L.restaurantRccm ? [`Restaurant trade register (RCCM): ${L.restaurantRccm}`] : []),
              ...(L.restaurantNiu ? [`Restaurant taxpayer number (NIU): ${L.restaurantNiu}`] : []),
              `Publication director: Mr ${L.publicationDirector}`,
            ],
          },
          {
            id: 'hosting',
            heading: 'Hosting',
            paragraphs: [`The website is hosted by ${L.host.name}, 101 Townsend St, San Francisco, CA 94107, United States — ${L.host.url}.`],
          },
          {
            id: 'ip',
            heading: 'Intellectual property',
            paragraphs: [
              'The texts, logos, trademarks, photographs, illustrations and layout of this website are protected by Cameroonian Law No. 2000/011 of 19 December 2000 on copyright and neighbouring rights and by the Bangui Agreement (OAPI).',
              'Any reproduction, representation, adaptation or distribution, in whole or in part, without the publisher’s prior written consent is prohibited, except where permitted by law.',
            ],
          },
          {
            id: 'images',
            heading: 'Images',
            paragraphs: [
              'The food photographs shown on this website are illustrative images generated by artificial intelligence; they are not contractual and dishes served at the restaurant may look different. The logo and the three-dimensional scene on the home page are original graphic creations.',
            ],
          },
          {
            id: 'information',
            heading: 'Menu, prices and opening hours',
            paragraphs: [
              'Prices are shown in CFA francs (FCFA), taxes included. The menu, prices and opening hours are updated with care but may change; in case of discrepancy, the information displayed at the restaurant prevails.',
            ],
          },
          {
            id: 'bookings',
            heading: 'Booking requests',
            paragraphs: [
              'The website’s form prepares a booking request that the user sends via WhatsApp. A request only becomes a booking once expressly confirmed by the restaurant.',
            ],
          },
          {
            id: 'links',
            heading: 'External links',
            paragraphs: [
              'The website links to third-party services (Instagram, Facebook, Tripadvisor, WhatsApp, map services). The publisher has no control over these services and accepts no liability for their content or practices.',
            ],
          },
          {
            id: 'data',
            heading: 'Personal data',
            paragraphs: [
              'How we process your personal data is described in our privacy policy, drawn up in accordance with Cameroonian Law No. 2024/017 of 23 December 2024 on the protection of personal data.',
            ],
          },
          {
            id: 'law',
            heading: 'Governing law',
            paragraphs: [
              'This website is governed by Cameroonian law, in particular Laws No. 2010/021 and No. 2010/012 of 21 December 2010. Subject to mandatory consumer protection rules, the courts of Douala have jurisdiction over any dispute.',
            ],
          },
        ],
        prevails: 'This English version is provided for convenience. In case of discrepancy, the French version prevails.',
      };

    case 'ko':
      return {
        intro: [
          `카메룬 전자상거래에 관한 2010년 12월 21일 법률 제2010/021호에 따라 ${site.url.replace('https://', '')} 이용자에게 다음 정보를 안내합니다.`,
        ],
        sections: [
          {
            id: 'publisher',
            heading: '사이트 운영자',
            paragraphs: [
              `본 사이트는 가족이 운영하는 레스토랑 「${site.fullName}」을 위해 개인(비사업자)인 ${L.publisher}가 제작·운영합니다.`,
            ],
            list: [
              `연락 주소: ${address('ko')}`,
              ...contactLine('ko'),
              ...(L.restaurantRccm ? [`레스토랑 상업등기번호(RCCM): ${L.restaurantRccm}`] : []),
              ...(L.restaurantNiu ? [`레스토랑 납세자 번호(NIU): ${L.restaurantNiu}`] : []),
              `발행 책임자: ${L.publicationDirector}`,
            ],
          },
          {
            id: 'hosting',
            heading: '호스팅',
            paragraphs: [`본 사이트는 ${L.host.name}(101 Townsend St, San Francisco, CA 94107, 미국)에서 호스팅됩니다.`],
          },
          {
            id: 'ip',
            heading: '지식재산권',
            paragraphs: [
              '본 사이트의 텍스트, 로고, 상표, 사진, 일러스트 및 레이아웃은 카메룬 저작권 및 저작인접권에 관한 2000년 12월 19일 법률 제2000/011호와 방기 협정(OAPI)에 의해 보호됩니다.',
              '법률이 허용하는 경우를 제외하고, 운영자의 사전 서면 동의 없이 전부 또는 일부를 복제, 게시, 변경, 배포하는 행위를 금지합니다.',
            ],
          },
          {
            id: 'images',
            heading: '이미지',
            paragraphs: ['사이트에 게시된 요리 사진은 인공지능으로 생성된 참고용 이미지이며, 실제 제공되는 요리의 모습과 다를 수 있습니다. 로고와 홈페이지의 3D 장면은 독자적인 그래픽 창작물입니다.'],
          },
          {
            id: 'information',
            heading: '메뉴, 가격 및 영업시간',
            paragraphs: [
              '가격은 CFA 프랑(FCFA) 기준이며 세금이 포함되어 있습니다. 메뉴, 가격, 영업시간은 변경될 수 있으며, 차이가 있을 경우 매장에 게시된 정보가 우선합니다.',
            ],
          },
          {
            id: 'bookings',
            heading: '예약 요청',
            paragraphs: ['사이트의 양식은 이용자가 WhatsApp으로 보내는 예약 요청을 작성해 줍니다. 예약은 레스토랑이 확정한 후에만 성립합니다.'],
          },
          {
            id: 'links',
            heading: '외부 링크',
            paragraphs: [
              '본 사이트에는 외부 서비스(Instagram, Facebook, Tripadvisor, WhatsApp, 지도 서비스)로 연결되는 링크가 있습니다. 운영자는 해당 서비스의 내용이나 운영 방식에 대해 책임지지 않습니다.',
            ],
          },
          {
            id: 'data',
            heading: '개인정보',
            paragraphs: ['개인정보 처리 방식은 카메룬 개인정보 보호에 관한 2024년 12월 23일 법률 제2024/017호에 따라 작성된 개인정보 처리방침에서 확인하실 수 있습니다.'],
          },
          {
            id: 'law',
            heading: '준거법',
            paragraphs: [
              '본 사이트는 카메룬 법률, 특히 2010년 12월 21일 법률 제2010/021호 및 제2010/012호의 적용을 받습니다. 소비자 보호에 관한 강행 규정을 제외하고, 모든 분쟁은 두알라 법원의 관할에 속합니다.',
            ],
          },
        ],
        prevails: '본 한국어 번역은 이용 편의를 위해 제공됩니다. 내용상 차이가 있을 경우 프랑스어 원문이 우선합니다.',
      };

    case 'zh':
      return {
        intro: [`根据喀麦隆 2010 年 12 月 21 日第 2010/021 号电子商务法，现向 ${site.url.replace('https://', '')} 的用户提供以下信息。`],
        sections: [
          {
            id: 'publisher',
            heading: '网站发布者',
            paragraphs: [
              `本网站由自然人 ${L.publisher} 先生以非职业身份为家庭经营的「${site.fullName}」餐厅发布。`,
            ],
            list: [
              `联系地址：${address('zh')}`,
              ...contactLine('zh'),
              ...(L.restaurantRccm ? [`餐厅商业登记号（RCCM）：${L.restaurantRccm}`] : []),
              ...(L.restaurantNiu ? [`餐厅纳税人识别号（NIU）：${L.restaurantNiu}`] : []),
              `出版负责人：${L.publicationDirector} 先生`,
            ],
          },
          {
            id: 'hosting',
            heading: '网站托管',
            paragraphs: [`本网站由 ${L.host.name}（美国加利福尼亚州旧金山 Townsend 街 101 号，邮编 94107）托管。`],
          },
          {
            id: 'ip',
            heading: '知识产权',
            paragraphs: [
              '本网站的文字、标志、商标、照片、插图及版面设计受喀麦隆 2000 年 12 月 19 日第 2000/011 号著作权及邻接权法以及《班吉协定》（OAPI）保护。',
              '除法律允许的情形外，未经发布者事先书面同意，禁止全部或部分复制、展示、改编或传播。',
            ],
          },
          {
            id: 'images',
            heading: '图片',
            paragraphs: ['本网站展示的菜品图片由人工智能生成，仅供参考，不构成合同内容；餐厅实际供应的菜品外观可能有所不同。标志及首页的三维场景为原创图形作品。'],
          },
          {
            id: 'information',
            heading: '菜单、价格与营业时间',
            paragraphs: ['价格以中非法郎（FCFA）计，已含税。菜单、价格和营业时间可能调整；如有出入，以餐厅现场公布的信息为准。'],
          },
          {
            id: 'bookings',
            heading: '预订请求',
            paragraphs: ['网站表单用于生成由用户通过 WhatsApp 发送的预订请求。预订请求须经餐厅明确确认后方为有效预订。'],
          },
          {
            id: 'links',
            heading: '外部链接',
            paragraphs: ['本网站包含指向第三方服务（Instagram、Facebook、Tripadvisor、WhatsApp、地图服务）的链接。发布者无法控制这些服务，对其内容或做法不承担任何责任。'],
          },
          {
            id: 'data',
            heading: '个人数据',
            paragraphs: ['我们对个人数据的处理方式详见隐私政策，该政策依据喀麦隆 2024 年 12 月 23 日第 2024/017 号个人数据保护法制定。'],
          },
          {
            id: 'law',
            heading: '适用法律',
            paragraphs: ['本网站受喀麦隆法律管辖，尤其是 2010 年 12 月 21 日第 2010/021 号和第 2010/012 号法律。除消费者保护强制性规定外，任何争议均由杜阿拉法院管辖。'],
          },
        ],
        prevails: '本中文译本仅为方便阅读而提供。如有歧义，以法文版本为准。',
      };
  }
}

/* ───────────────────────── Politique de confidentialité ───────────────────────── */

export function privacyPolicy(locale: Locale): LegalDocument {
  switch (locale) {
    case 'fr':
      return {
        intro: [
          'La présente politique explique quelles données personnelles nous traitons lorsque vous consultez ce site ou nous adressez une demande de réservation, pourquoi, et quels sont vos droits.',
          'Elle est établie conformément à la loi n° 2024/017 du 23 décembre 2024 relative à la protection des données à caractère personnel au Cameroun, à la loi n° 2010/012 du 21 décembre 2010 relative à la cybersécurité et la cybercriminalité et, pour les visiteurs résidant dans l’Union européenne, au règlement (UE) 2016/679 (RGPD).',
        ],
        sections: [
          {
            id: 'responsable',
            heading: 'Responsable du traitement',
            paragraphs: [`Le restaurant «\u00a0${site.fullName}\u00a0», exploitation familiale, ${address('fr')}. Pour toute question relative au site lui-même, vous pouvez aussi joindre son éditeur, M. ${L.publisher}, par l’intermédiaire du restaurant.`],
            list: contactLine('fr'),
          },
          {
            id: 'reservation',
            heading: 'Demandes de réservation',
            paragraphs: [
              'Lorsque vous utilisez le formulaire de réservation, vous renseignez : votre nom, votre numéro de téléphone, la date et l’heure souhaitées, le nombre de convives, le type de table et, si vous le souhaitez, un message.',
              'Ces informations sont mises en forme directement dans votre navigateur : elles ne sont ni envoyées à nos serveurs, ni enregistrées par le site. Elles ne nous parviennent que lorsque vous choisissez d’envoyer le message préparé dans WhatsApp.',
              'Finalité : traiter et confirmer votre réservation, puis vous accueillir. Base légale : l’exécution de mesures précontractuelles prises à votre demande.',
              'Si vous mentionnez une allergie ou une contrainte alimentaire, cette information relative à votre santé n’est utilisée que pour préparer votre repas en sécurité, avec votre consentement explicite, que vous pouvez retirer à tout moment.',
            ],
          },
          {
            id: 'whatsapp',
            heading: 'WhatsApp',
            paragraphs: [
              `Les échanges par WhatsApp transitent par le service de WhatsApp (groupe Meta), qui agit comme responsable de traitement distinct pour son propre service et applique sa propre politique de confidentialité : ${WHATSAPP_PRIVACY}. Si vous ne souhaitez pas utiliser WhatsApp, vous pouvez réserver par téléphone.`,
            ],
          },
          {
            id: 'navigation',
            heading: 'Consultation du site',
            paragraphs: [
              `Comme tout site web, notre hébergeur ${L.host.name} traite des données techniques de connexion (adresse IP, type de navigateur, pages consultées, date et heure) afin d’assurer la sécurité et la disponibilité du site. Base légale : notre intérêt légitime à protéger le site. Politique de l’hébergeur : ${CLOUDFLARE_PRIVACY}.`,
            ],
          },
          {
            id: 'cookies',
            heading: 'Cookies et traceurs',
            paragraphs: [
              'Ce site n’utilise ni cookie publicitaire, ni outil de mesure d’audience, ni traceur de réseau social. Aucun bandeau de consentement n’est donc nécessaire. Votre choix de langue est simplement indiqué dans l’adresse de la page.',
              'Notre hébergeur peut déposer des cookies strictement nécessaires à la sécurité du site (protection contre les robots malveillants), exemptés de consentement.',
              `La carte Google Maps n’est chargée que si vous cliquez sur « Afficher la carte ». Google peut alors collecter des données de connexion et déposer des cookies selon sa propre politique : ${GOOGLE_PRIVACY}.`,
            ],
          },
          {
            id: 'destinataires',
            heading: 'Destinataires et transferts',
            paragraphs: [
              'Vos données sont destinées exclusivement à l’équipe du restaurant. Elles ne sont jamais vendues ni utilisées à des fins publicitaires.',
              'Nos prestataires techniques (Cloudflare pour l’hébergement ; WhatsApp/Meta pour la messagerie ; Google si vous affichez la carte) peuvent traiter des données en dehors du Cameroun, notamment aux États-Unis et dans l’Union européenne, dans le cadre des garanties contractuelles qu’ils proposent.',
            ],
          },
          {
            id: 'conservation',
            heading: 'Durées de conservation',
            list: [
              'Demandes de réservation et échanges associés : le temps de traiter la réservation, puis au plus 12 mois.',
              'Informations d’allergie : supprimées après votre venue.',
              'Journaux techniques de l’hébergeur : selon la politique de Cloudflare, pour une durée limitée.',
            ],
          },
          {
            id: 'securite',
            heading: 'Sécurité',
            paragraphs: [
              'Le site est servi exclusivement en HTTPS, protégé par des en-têtes de sécurité stricts, et ne comporte aucune base de données de clients.',
            ],
          },
          {
            id: 'droits',
            heading: 'Vos droits',
            paragraphs: [
              'Vous disposez d’un droit d’accès, de rectification, d’effacement, d’opposition et de limitation du traitement de vos données, ainsi que du droit de retirer votre consentement à tout moment. Pour les exercer, contactez-nous par téléphone, par WhatsApp ou par courrier à l’adresse du restaurant. Nous vous répondrons dans un délai d’un mois au plus.',
              'Vous pouvez également introduire une réclamation auprès de l’autorité de protection des données à caractère personnel instituée par la loi n° 2024/017 et, si vous résidez dans l’Union européenne, auprès de l’autorité de contrôle de votre pays (en France : la CNIL).',
            ],
          },
          {
            id: 'modifications',
            heading: 'Modifications',
            paragraphs: ['Cette politique peut être mise à jour. La date de dernière mise à jour figure en haut de cette page.'],
          },
        ],
      };

    case 'en':
      return {
        intro: [
          'This policy explains which personal data we process when you visit this website or send us a booking request, why we do so, and what your rights are.',
          'It is drawn up in accordance with Cameroonian Law No. 2024/017 of 23 December 2024 on the protection of personal data, Law No. 2010/012 of 21 December 2010 on cybersecurity and cybercrime and, for visitors residing in the European Union, Regulation (EU) 2016/679 (GDPR).',
        ],
        sections: [
          {
            id: 'controller',
            heading: 'Data controller',
            paragraphs: [`The family-run restaurant “${site.fullName}”, ${address('en')}. For any question about the website itself, you can also reach its publisher, Mr ${L.publisher}, through the restaurant.`],
            list: contactLine('en'),
          },
          {
            id: 'booking',
            heading: 'Booking requests',
            paragraphs: [
              'When you use the booking form, you provide: your name, phone number, preferred date and time, number of guests, table type and, if you wish, a message.',
              'This information is formatted directly in your browser: it is neither sent to our servers nor stored by the website. It only reaches us when you choose to send the prepared message in WhatsApp.',
              'Purpose: to process and confirm your booking and to welcome you. Legal basis: steps taken at your request prior to entering into a contract.',
              'If you mention an allergy or dietary requirement, this health-related information is used solely to prepare your meal safely, with your explicit consent, which you may withdraw at any time.',
            ],
          },
          {
            id: 'whatsapp',
            heading: 'WhatsApp',
            paragraphs: [
              `Messages sent via WhatsApp pass through WhatsApp’s service (Meta group), which acts as a separate controller for its own service under its own privacy policy: ${WHATSAPP_PRIVACY}. If you prefer not to use WhatsApp, you can book by phone.`,
            ],
          },
          {
            id: 'browsing',
            heading: 'Visiting the website',
            paragraphs: [
              `Like any website, our host ${L.host.name} processes technical connection data (IP address, browser type, pages visited, date and time) to keep the website secure and available. Legal basis: our legitimate interest in protecting the website. Host’s policy: ${CLOUDFLARE_PRIVACY}.`,
            ],
          },
          {
            id: 'cookies',
            heading: 'Cookies and trackers',
            paragraphs: [
              'This website uses no advertising cookies, no audience measurement and no social media trackers, so no consent banner is required. Your language choice is simply reflected in the page address.',
              'Our host may set cookies that are strictly necessary for security (protection against malicious bots), which are exempt from consent.',
              `The Google Maps map is only loaded if you click “Show the map”. Google may then collect connection data and set cookies under its own policy: ${GOOGLE_PRIVACY}.`,
            ],
          },
          {
            id: 'recipients',
            heading: 'Recipients and transfers',
            paragraphs: [
              'Your data is intended solely for the restaurant team. It is never sold or used for advertising.',
              'Our technical providers (Cloudflare for hosting; WhatsApp/Meta for messaging; Google if you display the map) may process data outside Cameroon, notably in the United States and the European Union, under the contractual safeguards they offer.',
            ],
          },
          {
            id: 'retention',
            heading: 'Retention periods',
            list: [
              'Booking requests and related messages: for as long as needed to handle the booking, then no more than 12 months.',
              'Allergy information: deleted after your visit.',
              'Host’s technical logs: for a limited period under Cloudflare’s policy.',
            ],
          },
          {
            id: 'security',
            heading: 'Security',
            paragraphs: ['The website is served over HTTPS only, protected by strict security headers, and holds no customer database.'],
          },
          {
            id: 'rights',
            heading: 'Your rights',
            paragraphs: [
              'You have the right to access, rectify, erase, object to and restrict the processing of your data, and to withdraw your consent at any time. To exercise these rights, contact us by phone, WhatsApp or post at the restaurant’s address. We will reply within one month at most.',
              'You may also lodge a complaint with the personal data protection authority established by Law No. 2024/017 and, if you reside in the European Union, with your national supervisory authority.',
            ],
          },
          {
            id: 'changes',
            heading: 'Changes',
            paragraphs: ['This policy may be updated. The date of the latest update is shown at the top of this page.'],
          },
        ],
        prevails: 'This English version is provided for convenience. In case of discrepancy, the French version prevails.',
      };

    case 'ko':
      return {
        intro: [
          '본 방침은 이용자가 사이트를 방문하거나 예약 요청을 보낼 때 어떤 개인정보를 왜 처리하는지, 그리고 이용자의 권리가 무엇인지 설명합니다.',
          '본 방침은 카메룬 개인정보 보호에 관한 2024년 12월 23일 법률 제2024/017호, 사이버보안 및 사이버범죄에 관한 2010년 12월 21일 법률 제2010/012호, 그리고 유럽연합 거주자의 경우 일반개인정보보호규정(GDPR, 규정 (EU) 2016/679)에 따라 작성되었습니다.',
        ],
        sections: [
          {
            id: 'controller',
            heading: '개인정보 처리 책임자',
            paragraphs: [`가족이 운영하는 레스토랑 「${site.fullName}」, ${address('ko')}. 사이트 자체에 관한 문의는 레스토랑을 통해 사이트 운영자 ${L.publisher}에게도 하실 수 있습니다.`],
            list: contactLine('ko'),
          },
          {
            id: 'booking',
            heading: '예약 요청',
            paragraphs: [
              '예약 양식에는 이름, 전화번호, 희망 날짜와 시간, 인원, 테이블 유형, 그리고 원하실 경우 메시지를 입력합니다.',
              '입력한 정보는 이용자의 브라우저 안에서만 정리되며, 당사 서버로 전송되거나 사이트에 저장되지 않습니다. 이용자가 WhatsApp에서 준비된 메시지를 직접 보낼 때에만 당사에 전달됩니다.',
              '목적: 예약 처리 및 확정, 방문 응대. 법적 근거: 이용자의 요청에 따른 계약 체결 전 조치.',
              '알레르기나 식이 제한을 알려 주시는 경우, 이 건강 관련 정보는 이용자의 명시적 동의에 따라 안전한 식사 준비에만 사용되며, 동의는 언제든지 철회할 수 있습니다.',
            ],
          },
          {
            id: 'whatsapp',
            heading: 'WhatsApp',
            paragraphs: [
              `WhatsApp 메시지는 WhatsApp(Meta 그룹) 서비스를 거치며, WhatsApp은 자체 서비스에 대해 별도의 처리 책임자로서 자체 개인정보 처리방침을 적용합니다: ${WHATSAPP_PRIVACY}. WhatsApp 사용을 원하지 않으시면 전화로 예약하실 수 있습니다.`,
            ],
          },
          {
            id: 'browsing',
            heading: '사이트 이용',
            paragraphs: [
              `모든 웹사이트와 마찬가지로, 호스팅 업체 ${L.host.name}는 사이트의 보안과 가용성을 위해 기술적 접속 정보(IP 주소, 브라우저 종류, 방문 페이지, 날짜와 시간)를 처리합니다. 법적 근거: 사이트 보호에 대한 정당한 이익. 호스팅 업체 방침: ${CLOUDFLARE_PRIVACY}.`,
            ],
          },
          {
            id: 'cookies',
            heading: '쿠키 및 추적 기술',
            paragraphs: [
              '본 사이트는 광고 쿠키, 방문자 분석 도구, 소셜 미디어 추적기를 사용하지 않으므로 쿠키 동의 배너가 필요하지 않습니다. 언어 선택은 페이지 주소에만 반영됩니다.',
              '호스팅 업체가 보안(악성 봇 차단)에 반드시 필요한 쿠키를 설정할 수 있으며, 이는 동의 대상에서 제외됩니다.',
              `Google 지도는 「지도 보기」를 클릭하는 경우에만 불러옵니다. 이때 Google이 자체 방침에 따라 접속 정보를 수집하고 쿠키를 설정할 수 있습니다: ${GOOGLE_PRIVACY}.`,
            ],
          },
          {
            id: 'recipients',
            heading: '수령인 및 국외 이전',
            paragraphs: [
              '개인정보는 레스토랑 직원만 이용하며, 판매하거나 광고에 사용하지 않습니다.',
              '기술 서비스 제공자(호스팅: Cloudflare, 메시징: WhatsApp/Meta, 지도 표시 시: Google)는 자사가 제공하는 계약상 보호 조치에 따라 카메룬 외 지역(특히 미국 및 유럽연합)에서 데이터를 처리할 수 있습니다.',
            ],
          },
          {
            id: 'retention',
            heading: '보관 기간',
            list: [
              '예약 요청 및 관련 메시지: 예약 처리에 필요한 기간 후 최대 12개월.',
              '알레르기 정보: 방문 후 삭제.',
              '호스팅 업체의 기술 로그: Cloudflare 방침에 따른 제한된 기간.',
            ],
          },
          {
            id: 'security',
            heading: '보안',
            paragraphs: ['본 사이트는 HTTPS로만 제공되며, 엄격한 보안 헤더로 보호되고, 고객 데이터베이스를 보유하지 않습니다.'],
          },
          {
            id: 'rights',
            heading: '이용자의 권리',
            paragraphs: [
              '이용자는 개인정보의 열람, 정정, 삭제, 처리 반대 및 제한을 요구할 권리와 언제든지 동의를 철회할 권리가 있습니다. 전화, WhatsApp 또는 레스토랑 주소로 우편을 보내 권리를 행사하실 수 있으며, 늦어도 1개월 이내에 답변해 드립니다.',
              '또한 법률 제2024/017호에 따라 설립된 개인정보 보호 기관에 민원을 제기할 수 있으며, 유럽연합 거주자는 거주국 감독 기관에 민원을 제기할 수 있습니다.',
            ],
          },
          {
            id: 'changes',
            heading: '변경',
            paragraphs: ['본 방침은 변경될 수 있으며, 최종 수정일은 이 페이지 상단에 표시됩니다.'],
          },
        ],
        prevails: '본 한국어 번역은 이용 편의를 위해 제공됩니다. 내용상 차이가 있을 경우 프랑스어 원문이 우선합니다.',
      };

    case 'zh':
      return {
        intro: [
          '本政策说明您浏览本网站或向我们发送预订请求时，我们处理哪些个人数据、处理的原因以及您享有的权利。',
          '本政策依据喀麦隆 2024 年 12 月 23 日第 2024/017 号个人数据保护法、2010 年 12 月 21 日第 2010/012 号网络安全与网络犯罪法制定；对于居住在欧盟的访客，亦依据《通用数据保护条例》（GDPR，第 (EU) 2016/679 号条例）。',
        ],
        sections: [
          {
            id: 'controller',
            heading: '数据控制者',
            paragraphs: [`家庭经营的「${site.fullName}」餐厅，${address('zh')}。有关网站本身的问题，您也可以通过餐厅联系网站发布者 ${L.publisher} 先生。`],
            list: contactLine('zh'),
          },
          {
            id: 'booking',
            heading: '预订请求',
            paragraphs: [
              '使用预订表单时，您需填写：姓名、电话号码、期望的日期和时间、用餐人数、餐桌类型，以及（可选）留言。',
              '这些信息仅在您的浏览器中整理生成，既不会发送到我们的服务器，也不会被网站保存。只有当您选择在 WhatsApp 中发送已准备好的消息时，我们才会收到。',
              '目的：处理并确认您的预订，以及接待您用餐。法律依据：应您的要求在订立合同前采取的措施。',
              '如果您告知过敏或饮食限制，这些与健康相关的信息仅在您明确同意的前提下用于安全地准备餐食，您可随时撤回同意。',
            ],
          },
          {
            id: 'whatsapp',
            heading: 'WhatsApp',
            paragraphs: [
              `通过 WhatsApp 发送的消息经由 WhatsApp（Meta 集团）服务传输，WhatsApp 作为其自身服务的独立数据控制者，适用其自身的隐私政策：${WHATSAPP_PRIVACY}。如您不希望使用 WhatsApp，可致电预订。`,
            ],
          },
          {
            id: 'browsing',
            heading: '浏览网站',
            paragraphs: [
              `与所有网站一样，我们的托管服务商 ${L.host.name} 会处理技术连接数据（IP 地址、浏览器类型、访问页面、日期和时间），以保障网站安全和可用性。法律依据：我们保护网站的正当利益。托管服务商政策：${CLOUDFLARE_PRIVACY}。`,
            ],
          },
          {
            id: 'cookies',
            heading: 'Cookie 与追踪技术',
            paragraphs: [
              '本网站不使用广告 Cookie、访问统计工具或社交媒体追踪器，因此无需 Cookie 同意横幅。您选择的语言仅体现在页面网址中。',
              '托管服务商可能设置保障安全（防御恶意机器人）所必需的 Cookie，此类 Cookie 无需征得同意。',
              `仅当您点击「显示地图」时才会加载 Google 地图。届时 Google 可能根据其自身政策收集连接数据并设置 Cookie：${GOOGLE_PRIVACY}。`,
            ],
          },
          {
            id: 'recipients',
            heading: '接收方与跨境传输',
            paragraphs: [
              '您的数据仅供餐厅团队使用，绝不出售，也不用于广告。',
              '我们的技术服务商（托管：Cloudflare；即时通讯：WhatsApp/Meta；显示地图时：Google）可能依据其提供的合同保障措施，在喀麦隆境外（尤其是美国和欧盟）处理数据。',
            ],
          },
          {
            id: 'retention',
            heading: '保存期限',
            list: ['预订请求及相关消息：处理预订所需期间，之后最长 12 个月。', '过敏信息：用餐后删除。', '托管服务商的技术日志：依据 Cloudflare 政策保存有限期间。'],
          },
          {
            id: 'security',
            heading: '安全',
            paragraphs: ['本网站仅通过 HTTPS 提供，受严格的安全标头保护，且不设客户数据库。'],
          },
          {
            id: 'rights',
            heading: '您的权利',
            paragraphs: [
              '您有权访问、更正、删除您的数据，反对或限制对其的处理，并可随时撤回同意。如需行使上述权利，请通过电话、WhatsApp 或邮寄至餐厅地址与我们联系。我们将在一个月内答复。',
              '您亦可向依据第 2024/017 号法律设立的个人数据保护机构投诉；居住在欧盟的访客可向其所在国的监管机构投诉。',
            ],
          },
          {
            id: 'changes',
            heading: '政策更新',
            paragraphs: ['本政策可能会更新，最后更新日期显示在本页顶部。'],
          },
        ],
        prevails: '本中文译本仅为方便阅读而提供。如有歧义，以法文版本为准。',
      };
  }
}

/** Liste les champs légaux encore à compléter (affichés en avertissement à la compilation). */
export const missingLegalFields = () =>
  Object.entries(L)
    .filter(([, value]) => typeof value === 'string' && value.startsWith('['))
    .map(([key]) => key);
