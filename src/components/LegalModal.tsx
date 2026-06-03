import { X } from 'lucide-react';
import type { Lang } from '../i18n/translations';

type ModalType = 'legal' | 'privacy';

type LegalModalProps = {
  open: boolean;
  type: ModalType;
  lang: Lang;
  onClose: () => void;
};

type Section = {
  title: string;
  paragraphs: string[];
};

type Content = {
  title: string;
  intro: string;
  sections: Section[];
  footerNote: string;
};

const contentByLang: Record<Lang, Record<ModalType, Content>> = {
  fr: {
    legal: {
      title: 'Mentions légales',
      intro:
        'Le présent site a pour objet de présenter le restaurant Seoul et de permettre la prise de contact et l’envoi d’une demande de réservation via WhatsApp.',
      sections: [
        {
          title: 'Éditeur du site',
          paragraphs: [
            'Le site restaurant-seoul-douala.com est édité pour le compte de Seoul Restaurant Coréen, situé à côté de LGM, Rue Chococho, Douala, Cameroun.',
            'Téléphone : +237 6 99 21 13 00.',
          ],
        },
        {
          title: 'Directeur de publication',
          paragraphs: [
            'Le directeur de publication est l’exploitant du restaurant Seoul ou toute personne mandatée pour gérer ses contenus numériques.',
          ],
        },
        {
          title: 'Hébergement',
          paragraphs: [
            'Le site est hébergé sur l’infrastructure Cloudflare Pages / Cloudflare, Inc.',
            'Adresse de l’hébergeur : 101 Townsend St, San Francisco, CA 94107, USA.',
          ],
        },
        {
          title: 'Propriété intellectuelle',
          paragraphs: [
            'Les textes, éléments graphiques, logos, photographies, mises en page et contenus présents sur ce site sont protégés par les règles applicables en matière de propriété intellectuelle.',
            'Toute reproduction, diffusion, adaptation ou utilisation sans autorisation préalable est interdite, sauf usage strictement privé ou autorisé par la loi.',
          ],
        },
        {
          title: 'Responsabilité',
          paragraphs: [
            'Malgré tout le soin apporté à la mise à jour des informations, le restaurant ne peut garantir l’absence totale d’erreurs, d’omissions ou d’indisponibilités temporaires.',
            'Les informations relatives aux menus, prix, horaires et disponibilités sont fournies à titre indicatif et peuvent évoluer.',
          ],
        },
      ],
      footerNote:
        'Pour toute demande juridique, rectification d’information ou signalement, merci de contacter directement le restaurant au numéro indiqué ci-dessus.',
    },
    privacy: {
      title: 'Politique de confidentialité',
      intro:
        'La présente politique explique de manière transparente quelles données peuvent être utilisées lorsque vous naviguez sur le site ou effectuez une demande de réservation.',
      sections: [
        {
          title: 'Données collectées',
          paragraphs: [
            'Le site ne crée pas de compte client et ne collecte pas de données sensibles pour un traitement interne complexe.',
            'Lors d’une demande de réservation, vous renseignez vous-même des informations telles que le nom, le numéro de téléphone, la date, l’heure, le nombre de personnes, le type de table et un éventuel message.',
          ],
        },
        {
          title: 'Mode de transmission',
          paragraphs: [
            'Les demandes de réservation sont préparées sur votre appareil puis transmises par WhatsApp lorsque vous validez l’envoi. Le site lui-même n’envoie pas automatiquement le message sans votre action.',
            'Les informations saisies dans le formulaire sont utilisées uniquement pour préparer le message de réservation.',
          ],
        },
        {
          title: 'Finalité',
          paragraphs: [
            'Les données servent uniquement à gérer les demandes de réservation, à vous recontacter au besoin et à organiser l’accueil au restaurant.',
            'Aucune donnée n’est utilisée pour la revente, le profilage commercial abusif ou des traitements non liés à l’activité du restaurant.',
          ],
        },
        {
          title: 'Cookies et mesure technique',
          paragraphs: [
            'Le site peut utiliser uniquement des technologies techniques nécessaires à son bon fonctionnement, à la sécurité ou à la compatibilité de l’affichage.',
            'Aucun parcours publicitaire invasif n’est mis en place à travers le site.',
          ],
        },
        {
          title: 'Vos droits',
          paragraphs: [
            'Vous pouvez demander la rectification ou la suppression d’informations communiquées dans le cadre d’une réservation, dans la mesure où cela est compatible avec la bonne gestion de votre demande.',
            'Pour toute demande relative à vos données, vous pouvez contacter directement le restaurant par téléphone.',
          ],
        },
      ],
      footerNote:
        'En utilisant le site et en choisissant d’envoyer une réservation via WhatsApp, vous acceptez ce mode de transmission des informations nécessaires à la réservation.',
    },
  },
  en: {
    legal: {
      title: 'Legal notice',
      intro:
        'This website presents Seoul Restaurant and allows visitors to contact the restaurant and send reservation requests via WhatsApp.',
      sections: [
        {
          title: 'Website publisher',
          paragraphs: [
            'The website restaurant-seoul-douala.com is published on behalf of Seoul Korean Restaurant, located next to LGM, Rue Chococho, Douala, Cameroon.',
            'Phone: +237 6 99 21 13 00.',
          ],
        },
        {
          title: 'Publication director',
          paragraphs: ['The publication director is the restaurant operator or any person duly authorized to manage the digital content of the restaurant.'],
        },
        {
          title: 'Hosting',
          paragraphs: [
            'The website is hosted on Cloudflare Pages / Cloudflare, Inc.',
            'Host address: 101 Townsend St, San Francisco, CA 94107, USA.',
          ],
        },
        {
          title: 'Intellectual property',
          paragraphs: [
            'Texts, graphics, logos, photographs, layouts and all site content are protected by applicable intellectual property laws.',
            'Any reproduction, publication, adaptation or reuse without prior authorization is prohibited, except where permitted by law.',
          ],
        },
        {
          title: 'Liability',
          paragraphs: [
            'Although every effort is made to keep the information accurate and up to date, the restaurant cannot guarantee the absence of temporary errors, omissions or interruptions.',
            'Menus, prices, schedules and availability may change at any time.',
          ],
        },
      ],
      footerNote: 'For any legal request or correction, please contact the restaurant directly using the phone number provided above.',
    },
    privacy: {
      title: 'Privacy policy',
      intro:
        'This policy explains clearly what data may be used when you browse the site or submit a reservation request.',
      sections: [
        {
          title: 'Data collected',
          paragraphs: [
            'The site does not create customer accounts and does not implement intrusive internal data processing.',
            'When making a reservation request, you may provide your name, phone number, date, time, party size, table type and an optional message.',
          ],
        },
        {
          title: 'How information is sent',
          paragraphs: [
            'Reservation requests are prepared on your device and sent through WhatsApp only when you confirm the message. The website itself does not send the message without your action.',
            'The data entered in the form is only used to generate the WhatsApp reservation request.',
          ],
        },
        {
          title: 'Purpose of processing',
          paragraphs: [
            'Information is used only to organize reservations, contact you if necessary and prepare your visit to the restaurant.',
            'The restaurant does not use your information for resale or unrelated profiling.',
          ],
        },
        {
          title: 'Cookies and technical tools',
          paragraphs: [
            'The site may rely on strictly necessary technical tools for security, display compatibility and website operation.',
            'No aggressive advertising tracking is intentionally deployed on the website.',
          ],
        },
        {
          title: 'Your rights',
          paragraphs: [
            'You may request correction or deletion of information shared in the context of a reservation, where compatible with proper booking management.',
            'For any request concerning your personal data, please contact the restaurant directly by phone.',
          ],
        },
      ],
      footerNote:
        'By using the site and choosing to send a reservation through WhatsApp, you agree to this method of transmitting the information required for your booking.',
    },
  },
  ko: {
    legal: {
      title: '법적 고지',
      intro: '본 사이트는 Seoul Restaurant를 소개하고 WhatsApp을 통한 예약 요청 및 연락을 지원합니다.',
      sections: [
        {
          title: '사이트 운영자',
          paragraphs: [
            'restaurant-seoul-douala.com은 카메룬 두알라 Rue Chococho, LGM 인근에 위치한 Seoul Restaurant를 위해 운영됩니다.',
            '전화번호: +237 6 99 21 13 00.',
          ],
        },
        {
          title: '발행 책임자',
          paragraphs: ['발행 책임자는 Seoul Restaurant 운영자 또는 디지털 콘텐츠 운영을 위임받은 자입니다.'],
        },
        {
          title: '호스팅',
          paragraphs: ['본 사이트는 Cloudflare Pages / Cloudflare, Inc. 인프라에 호스팅됩니다.', '주소: 101 Townsend St, San Francisco, CA 94107, USA.'],
        },
        {
          title: '지식재산권',
          paragraphs: ['사이트의 텍스트, 그래픽, 로고, 사진, 레이아웃 및 모든 콘텐츠는 관련 지식재산권 규정의 보호를 받습니다.', '사전 허가 없는 복제, 배포, 수정, 재사용은 법적으로 허용된 경우를 제외하고 금지됩니다.'],
        },
        {
          title: '책임 제한',
          paragraphs: ['정확한 정보를 제공하기 위해 노력하지만, 메뉴, 가격, 시간, 이용 가능 여부는 변경될 수 있으며 일시적 오류가 발생할 수 있습니다.'],
        },
      ],
      footerNote: '법적 문의나 정보 수정 요청은 위 전화번호로 직접 연락해 주세요.',
    },
    privacy: {
      title: '개인정보 처리방침',
      intro: '본 정책은 사이트 이용 또는 예약 요청 과정에서 어떤 정보가 사용될 수 있는지 명확하게 설명합니다.',
      sections: [
        {
          title: '수집되는 정보',
          paragraphs: ['사이트는 고객 계정을 생성하지 않으며 과도한 내부 데이터 처리를 수행하지 않습니다.', '예약 시 이름, 전화번호, 날짜, 시간, 인원, 테이블 종류 및 선택 메시지를 입력할 수 있습니다.'],
        },
        {
          title: '전송 방식',
          paragraphs: ['예약 정보는 사용자의 기기에서 준비되며, 사용자가 WhatsApp 전송을 확인할 때만 전달됩니다.', '사이트 자체가 사용자의 확인 없이 메시지를 자동 발송하지는 않습니다.'],
        },
        {
          title: '이용 목적',
          paragraphs: ['예약 관리, 필요한 경우 연락, 방문 준비를 위해서만 사용됩니다.', '정보는 재판매되거나 무관한 프로파일링에 사용되지 않습니다.'],
        },
        {
          title: '쿠키 및 기술적 요소',
          paragraphs: ['보안, 표시 호환성 및 사이트 작동에 필요한 최소한의 기술적 요소만 사용할 수 있습니다.', '침해적 광고 추적은 의도적으로 사용하지 않습니다.'],
        },
        {
          title: '이용자 권리',
          paragraphs: ['예약 관련 정보의 정정 또는 삭제를 요청할 수 있으며, 이는 예약 운영과 양립 가능한 범위에서 처리됩니다.', '개인정보 관련 요청은 전화로 직접 문의해 주세요.'],
        },
      ],
      footerNote: '사이트를 이용하고 WhatsApp 예약 전송을 선택함으로써 예약에 필요한 정보 전달 방식에 동의하는 것으로 간주됩니다.',
    },
  },
  zh: {
    legal: {
      title: '法律声明',
      intro: '本网站用于展示 Seoul Restaurant 并支持通过 WhatsApp 发送预订请求及联系餐厅。',
      sections: [
        {
          title: '网站发布者',
          paragraphs: ['restaurant-seoul-douala.com 由 Seoul Restaurant 使用，地址位于喀麦隆杜阿拉 Rue Chococho，LGM 附近。', '电话：+237 6 99 21 13 00。'],
        },
        {
          title: '出版负责人',
          paragraphs: ['出版负责人为餐厅经营者或被授权管理餐厅数字内容的人员。'],
        },
        {
          title: '网站托管',
          paragraphs: ['本网站托管于 Cloudflare Pages / Cloudflare, Inc.。', '地址：101 Townsend St, San Francisco, CA 94107, USA。'],
        },
        {
          title: '知识产权',
          paragraphs: ['网站中的文字、图形、标志、照片、排版及所有内容均受适用知识产权法律保护。', '未经事先授权，不得复制、传播、改编或再次使用，法律另有规定的除外。'],
        },
        {
          title: '责任限制',
          paragraphs: ['餐厅会尽力保持信息准确与更新，但菜单、价格、营业时间及供应情况可能随时调整。'],
        },
      ],
      footerNote: '如需法律相关信息或内容更正，请通过上述电话直接联系餐厅。',
    },
    privacy: {
      title: '隐私政策',
      intro: '本政策说明您在浏览网站或发送预订请求时，哪些信息可能被使用。',
      sections: [
        {
          title: '收集的数据',
          paragraphs: ['本网站不创建客户账户，也不进行侵入式内部数据处理。', '在预订时，您可能会提供姓名、电话号码、日期、时间、人数、桌型以及附加留言。'],
        },
        {
          title: '信息传输方式',
          paragraphs: ['预订信息会先在您的设备上生成，只有在您确认后，才会通过 WhatsApp 发送。', '网站不会在未经您确认的情况下自动发送消息。'],
        },
        {
          title: '处理目的',
          paragraphs: ['这些信息仅用于处理预订、必要时联系您以及安排用餐接待。', '餐厅不会将这些信息用于转售或与餐厅活动无关的画像分析。'],
        },
        {
          title: 'Cookie 与技术性工具',
          paragraphs: ['网站仅可能使用保障安全、显示兼容性和正常运行所必需的技术性工具。', '网站不主动部署侵入式广告追踪。'],
        },
        {
          title: '您的权利',
          paragraphs: ['您可以要求更正或删除在预订过程中提供的信息，前提是不影响预订处理。', '如有任何与个人数据相关的请求，请直接致电餐厅。'],
        },
      ],
      footerNote: '当您使用本网站并选择通过 WhatsApp 发送预订请求时，即表示您同意这种预订信息传输方式。',
    },
  },
};

const LegalModal = ({ open, type, lang, onClose }: LegalModalProps) => {
  if (!open) return null;

  const content = contentByLang[lang][type] ?? contentByLang.fr[type];

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center px-4 py-6">
      <div className="absolute inset-0 bg-black/80" onClick={onClose} />
        <div className="relative w-full max-w-4xl max-h-[90dvh] flex flex-col rounded-3xl border border-[#D4AF37]/18 bg-[#090909] shadow-[0_30px_120px_rgba(0,0,0,0.65)]">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent" />
        <div className="flex items-start justify-between gap-4 border-b border-white/8 px-6 py-5 sm:px-8 flex-shrink-0">
          <div>
            <p className="text-[10px] uppercase tracking-[0.34em] text-[#D4AF37]/45 mb-2">Seoul Restaurant Douala</p>
            <h3 className="text-2xl font-serif text-white/92">{content.title}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close legal modal"
            className="mt-1 rounded-full border border-white/10 p-2 text-white/45 transition-colors hover:border-[#D4AF37]/35 hover:text-[#D4AF37]"
          >
            <X size={16} />
          </button>
        </div>

        <div className="overflow-y-auto px-6 py-6 sm:px-8 sm:py-8 legal-scroll flex-grow pb-24 sm:pb-8">
          <p className="text-sm text-gray-300/90 font-light leading-7 mb-8">{content.intro}</p>

          <div className="space-y-7">
            {content.sections.map((section) => (
              <section key={section.title} className="rounded-2xl border border-white/6 bg-white/[0.02] p-5 sm:p-6">
                <h4 className="text-sm uppercase tracking-[0.24em] text-[#D4AF37]/72 mb-4">{section.title}</h4>
                <div className="space-y-3">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph} className="text-sm text-gray-400 font-light leading-7">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <div className="mt-8 rounded-2xl border border-[#D4AF37]/14 bg-[#D4AF37]/6 px-5 py-4">
            <p className="text-sm text-white/75 font-light leading-7">{content.footerNote}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LegalModal;
