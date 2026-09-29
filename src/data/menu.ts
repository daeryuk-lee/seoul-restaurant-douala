/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  LA CARTE — noms, descriptions et prix (en FCFA) des plats.
 * ─────────────────────────────────────────────────────────────────────────────
 *  • name.ko est le nom coréen (hangeul), affiché en second sur les autres langues.
 *  • price : un nombre, ou une liste de variantes { label?, value } (ex. 2 / 5 / 10 pièces).
 *  • spicy : niveau de piment de 1 à 4.
 *  • veg : true = végétarien (sans viande, poisson ni fruits de mer) ; 'option' = variante végétarienne possible.
 *    ⚠ À n'indiquer que si la recette réelle le garantit (bouillons, sauces, kimchi…).
 *  • isNew : étiquette « Nouveau » (jusqu'à la date définie dans src/config/site.ts).
 */
import type { ImageMetadata } from 'astro';
import type { Localized } from '../i18n/locales';
import bbq from '../assets/images/food/bbq.jpg';
import bibimbap from '../assets/images/food/bibimbap.jpg';
import friedChicken from '../assets/images/food/fried-chicken.jpg';
import grillade from '../assets/images/food/grillade.jpg';
import kimbap from '../assets/images/food/kimbap.jpg';
import noodles from '../assets/images/food/noodles.jpg';
import supplements from '../assets/images/food/supplements.jpg';
import sushi from '../assets/images/food/sushi.jpg';

export type PriceVariant = { label?: Localized; value: number };

export interface Dish {
  name: Localized;
  desc?: Localized;
  price: number | PriceVariant[];
  perPlate?: boolean;
  spicy?: 1 | 2 | 3 | 4;
  veg?: true | 'option';
  isNew?: boolean;
}

export type CategoryId =
  | 'barbecue'
  | 'entree'
  | 'specialite'
  | 'grillade_saute'
  | 'friture'
  | 'riz_ragout'
  | 'pate_nouilles'
  | 'supplements';

export interface Category {
  id: CategoryId;
  title: Localized;
  intro: Localized;
  image: ImageMetadata;
  imageAlt: Localized;
  /** Rubrique comportant des plats à base de poisson cru. */
  raw?: boolean;
  dishes: Dish[];
}

/** Texte en français, anglais, coréen et chinois (dans cet ordre). */
const L = (fr: string, en: string, ko: string, zh: string): Localized => ({ fr, en, ko, zh });
const pieces = (n: number) => L(`${n} pièces`, `${n} pieces`, `${n}개`, `${n}件`);
const extra = L('En supplément', 'Extra portion', '추가', '加点');

const dishes: Record<CategoryId, Dish[]> = {
  barbecue: [
    {
      name: L('Ouverture de barbecue', 'Barbecue set', '바베큐 세트', '烤肉套餐'),
      desc: L(
        'Deux viandes au choix, sauces, salade d’oignon vert, chou blanc assaisonné et feuilles de salade',
        'Two meats of your choice with sauces, green onion salad, seasoned white cabbage and lettuce leaves',
        '고기 2종 선택, 각종 소스, 파절이, 양배추 장아찌, 상추',
        '任选两种肉类，配各式酱料、葱丝沙拉、腌卷心菜及生菜',
      ),
      price: 21000,
    },
    { name: L('Poitrine de porc', 'Pork belly', '삼겹살', '五花肉'), price: 8500 },
    { name: L('Échine de porc', 'Pork neck', '목살', '猪颈肉'), price: 8500 },
    { name: L('Côtes de porc marinées', 'Marinated pork ribs', '돼지갈비', '调味猪排骨'), price: 8500 },
    { name: L('Filet de bœuf', 'Beef fillet', '소고기 안심', '牛里脊'), price: 8500 },
    { name: L('Mouton mariné', 'Marinated mutton', '양념 양고기', '调味羊肉'), price: 8500 },
    { name: L('Poulet mariné', 'Marinated chicken', '양념 닭고기', '调味鸡肉'), price: 8500 },
    { name: L('Salade d’oignon vert', 'Green onion salad', '파절이', '葱丝沙拉'), desc: extra, price: 3500 },
    { name: L('Chou blanc assaisonné', 'Seasoned white cabbage', '양배추 장아찌', '腌卷心菜'), desc: extra, price: 1500 },
    { name: L('Feuilles de salade', 'Lettuce leaves', '상추', '生菜'), desc: extra, price: 1000 },
  ],

  entree: [
    { name: L('Salade d’oignon vert', 'Green onion salad', '파절이', '葱丝沙拉'), price: 3500, spicy: 1, veg: true },
    { name: L('Salade maison', 'House salad', '하우스 샐러드', '招牌沙拉'), price: 4500, veg: true },
    { name: L('Salade avocat-crevettes', 'Avocado and prawn salad', '아보카도 새우 샐러드', '牛油果鲜虾沙拉'), price: 7500 },
    {
      name: L('Rouleaux de printemps', 'Spring rolls', '스프링롤', '春卷'),
      desc: L('Galette de riz garnie de légumes', 'Rice paper rolls filled with vegetables', '라이스페이퍼에 채소를 넣은 롤', '米纸卷蔬菜'),
      price: 5000,
      veg: true,
    },
    { name: L('Salade de poulet frit', 'Fried chicken salad', '치킨 샐러드', '炸鸡沙拉'), price: 8000 },
    {
      name: L('Salade de calamar et nouilles', 'Squid and noodle salad', '오징어 초무침', '醋拌鱿鱼'),
      desc: L(
        'Calamar et légumes relevés d’une sauce vinaigrée pimentée',
        'Squid and vegetables in a spicy vinegar dressing',
        '새콤매콤한 양념에 버무린 오징어와 야채',
        '鱿鱼与蔬菜拌酸辣酱汁',
      ),
      price: 8500,
      spicy: 3,
    },
    { name: L('Beignets de crevettes', 'Prawn tempura', '새우튀김', '炸虾'), price: 7000 },
    { name: L('Calamars frits', 'Fried squid', '오징어튀김', '炸鱿鱼'), price: 7000 },
    {
      name: L('Nems au poulet ou aux légumes', 'Fried spring rolls, chicken or vegetable', '닭고기 넴 또는 야채 넴', '炸春卷（鸡肉或蔬菜）'),
      price: 5000,
      veg: 'option',
    },
    {
      name: L('Mandu', 'Mandu', '만두', '韩式饺子'),
      desc: L('Raviolis coréens au porc ou au bœuf', 'Korean dumplings with pork or beef', '돼지고기 또는 소고기 만두', '猪肉或牛肉馅'),
      price: 5500,
    },
    { name: L('Kimbap au thon', 'Tuna kimbap', '참치김밥', '金枪鱼紫菜包饭'), price: 7500 },
    { name: L('Kimbap bulgogi', 'Bulgogi kimbap', '불고기김밥', '烤牛肉紫菜包饭'), price: 7500 },
    { name: L('Kimbap au poulet', 'Chicken kimbap', '닭불고기김밥', '鸡肉紫菜包饭'), price: 8500 },
    { name: L('Kimbap avocat-crevettes', 'Avocado and prawn kimbap', '아보카도새우김밥', '牛油果鲜虾紫菜包饭'), price: 8500 },
    { name: L('Kimbap surimi et fromage', 'Surimi and cheese kimbap', '치즈맛살김밥', '芝士蟹棒紫菜包饭'), price: 8500 },
    {
      name: L('Kimbap dragon', 'Dragon kimbap', '드래곤김밥', '龙卷紫菜包饭'),
      desc: L('Garni de viande panée : poulet, porc ou bœuf', 'Filled with breaded chicken, pork or beef', '닭고기, 돼지고기 또는 소고기 튀김', '内卷炸鸡肉、猪肉或牛肉'),
      price: 8500,
      spicy: 1,
    },
    {
      name: L('Kimbap dragon aux crevettes', 'Dragon prawn kimbap', '드래곤새우김밥', '炸虾龙卷紫菜包饭'),
      desc: L('Garni de crevettes frites', 'Filled with fried prawns', '새우튀김을 넣은 김밥', '内卷炸虾'),
      price: 9000,
      spicy: 1,
    },
    { name: L('Kimbap au saumon', 'Salmon kimbap', '연어김밥', '三文鱼紫菜包饭'), price: 14000 },
  ],

  specialite: [
    { name: L('Maki avocat', 'Avocado maki', '아보카도 마끼', '牛油果细卷'), desc: pieces(8), price: 5000, isNew: true },
    { name: L('Maki saumon', 'Salmon maki', '연어 마끼', '三文鱼细卷'), desc: pieces(8), price: 8000, isNew: true },
    { name: L('Maki avocat-saumon', 'Avocado and salmon maki', '아보카도연어 마끼', '牛油果三文鱼细卷'), desc: pieces(8), price: 8500, isNew: true },
    {
      name: L('SEOUL spécial (grand)', 'SEOUL special (large)', 'SEOUL 스페셜 (대)', 'SEOUL 特选拼盘（大）'),
      desc: L(
        'Assortiment de sushi, sashimi et kimbap — 32 pièces',
        'Assorted sushi, sashimi and kimbap — 32 pieces',
        '초밥, 회, 김밥 모듬 (32개)',
        '寿司、刺身与紫菜包饭拼盘（32件）',
      ),
      price: 54500,
    },
    {
      name: L('SEOUL spécial (petit)', 'SEOUL special (small)', 'SEOUL 스페셜 (소)', 'SEOUL 特选拼盘（小）'),
      desc: L('Assortiment de sushi et sashimi — 18 pièces', 'Assorted sushi and sashimi — 18 pieces', '초밥, 회 모듬 (18개)', '寿司与刺身拼盘（18件）'),
      price: 30500,
    },
    {
      name: L('Kimbap spécial', 'Kimbap special', '김밥 스페셜', '紫菜包饭特选拼盘'),
      desc: L('Assortiment de neuf kimbap', 'Assortment of nine kimbap', '김밥 9종 모듬', '九种紫菜包饭拼盘'),
      price: 49500,
    },
    {
      name: L('Sushi saumon', 'Salmon sushi', '연어 초밥', '三文鱼寿司'),
      price: [
        { label: pieces(2), value: 4500 },
        { label: pieces(5), value: 9000 },
        { label: pieces(10), value: 17000 },
      ],
    },
    {
      name: L('Sashimi saumon', 'Salmon sashimi', '연어회', '三文鱼刺身'),
      price: [
        { label: pieces(4), value: 6500 },
        { label: pieces(15), value: 20500 },
      ],
    },
    { name: L('Rouleau de saumon', 'Salmon roll', '연어롤', '三文鱼卷'), desc: pieces(5), price: 9500 },
    { name: L('Sushi poisson blanc', 'White fish sushi', '흰살생선 초밥', '白身鱼寿司'), desc: pieces(2), price: 4000 },
    { name: L('Sushi anguille', 'Eel sushi', '장어 초밥', '鳗鱼寿司'), desc: pieces(2), price: 5000 },
    { name: L('Sushi inari (tofu frit)', 'Inari sushi (fried tofu)', '유부초밥', '豆皮寿司'), desc: pieces(2), price: 5000 },
    { name: L('Sashimi poisson blanc', 'White fish sashimi', '흰살생선회', '白身鱼刺身'), desc: pieces(4), price: 5000 },
    { name: L('Sashimi anguille', 'Eel sashimi', '장어회', '鳗鱼刺身'), desc: pieces(4), price: 9500 },
    {
      name: L('Salade de poisson cru', 'Spicy raw fish salad', '회무침', '凉拌生鱼片'),
      desc: L(
        'Poisson cru et légumes relevés d’une sauce pimentée',
        'Raw fish and vegetables in a spicy sauce',
        '생선회와 야채를 매콤한 양념에 버무린 요리',
        '生鱼片与蔬菜拌香辣酱',
      ),
      price: 13000,
      spicy: 2,
    },
    {
      name: L('Bibimbap au poisson cru', 'Raw fish bibimbap', '회덮밥', '生鱼片盖饭'),
      desc: L(
        'Riz, crudités et poisson cru à mélanger avec une sauce pimentée',
        'Rice, fresh vegetables and raw fish to mix with a spicy sauce',
        '밥 위에 야채와 생선회를 올려 매콤한 소스에 비벼 먹는 덮밥',
        '米饭配蔬菜和生鱼片，拌辣酱食用',
      ),
      price: 10500,
      spicy: 2,
    },
  ],

  grillade_saute: [
    { name: L('Mouton grillé au cumin', 'Cumin grilled mutton', '쯔란 양고기 구이', '孜然烤羊肉'), price: 9000 },
    { name: L('Poulet grillé', 'Grilled chicken', '닭구이', '烤鸡'), price: 9000 },
    {
      name: L('Côtes de porc grillées', 'Grilled pork ribs', '돼지갈비 구이', '烤猪排骨'),
      desc: L('Marinées à la sauce soja', 'Marinated in soy sauce', '간장 양념', '酱油腌制'),
      price: 9000,
    },
    {
      name: L('Poisson grillé', 'Grilled fish', '생선구이', '烤鱼'),
      desc: L('Grillé sur plaque chauffante', 'Cooked on a hot iron plate', '철판에 구운 생선', '铁板烤制'),
      price: 7000,
    },
    {
      name: L('Poitrine de porc au piment', 'Spicy grilled pork belly', '고추장 삼겹살 구이', '辣酱烤五花肉'),
      desc: L(
        'Marinée à la pâte de piment coréenne (gochujang), puis grillée',
        'Marinated in Korean chilli paste (gochujang), then grilled',
        '고추장 양념에 재워 구운 삼겹살',
        '韩式辣酱腌制后烤制',
      ),
      price: 8500,
      spicy: 2,
    },
    {
      name: L('Bulgogi', 'Bulgogi', '불고기', '韩式烤牛肉'),
      desc: L('Bœuf mariné sauté aux légumes', 'Marinated beef stir-fried with vegetables', '양념 소고기와 야채 볶음', '腌牛肉炒蔬菜'),
      price: 7500,
    },
    {
      name: L('Porc sauté pimenté', 'Spicy stir-fried pork', '제육볶음', '韩式辣炒猪肉'),
      desc: L('Poitrine de porc sautée à la sauce pimentée', 'Pork belly stir-fried in a spicy sauce', '매콤한 양념의 돼지고기 볶음', '辣酱炒五花肉'),
      price: 8000,
      spicy: 3,
    },
    {
      name: L('Porc sauté au kimchi', 'Kimchi pork stir-fry', '김치제육볶음', '泡菜炒猪肉'),
      desc: L('Porc sauté au kimchi, sauce pimentée', 'Pork stir-fried with kimchi in a spicy sauce', '김치와 함께 볶은 매콤한 돼지고기', '泡菜辣炒猪肉'),
      price: 9000,
      spicy: 3,
    },
    {
      name: L('Calamar sauté et nouilles', 'Stir-fried squid with noodles', '오징어볶음', '辣炒鱿鱼'),
      desc: L(
        'Calamar et légumes sautés, sauce pimentée ou sauce soja',
        'Squid and vegetables stir-fried in a spicy or soy sauce',
        '매콤한 양념 또는 간장 양념',
        '鱿鱼炒蔬菜，可选辣酱或酱油口味',
      ),
      price: 8500,
      spicy: 3,
    },
    {
      name: L('Crevettes sauce chili', 'Chilli prawns', '칠리새우', '干烧虾仁'),
      desc: L('Crevettes sautées à la sauce chili', 'Prawns sautéed in chilli sauce', '칠리소스에 볶은 새우', '辣椒酱炒虾仁'),
      price: 9500,
    },
    {
      name: L('Tangsuyuk', 'Tangsuyuk', '탕수육', '韩式糖醋肉'),
      desc: L('Porc pané et frit, sauce aigre-douce', 'Crispy breaded pork with sweet and sour sauce', '새콤달콤한 소스의 바삭한 돼지고기 튀김', '酥炸猪肉配酸甜酱'),
      price: 8000,
    },
    {
      name: L('Dakgalbi (poulet sauté pimenté)', 'Dakgalbi (spicy stir-fried chicken)', '닭갈비', '韩式铁板鸡'),
      desc: L('Poulet sauté aux légumes', 'Chicken stir-fried with vegetables', '닭고기와 야채 볶음', '鸡肉炒蔬菜'),
      price: 9500,
      spicy: 2,
    },
  ],

  friture: [
    {
      name: L('Dakgangjeong (poulet croustillant sauce soja)', 'Dakgangjeong (crispy soy-glazed chicken)', '닭강정', '酱香炸鸡块'),
      price: 7500,
    },
    {
      name: L('Fried chicken', 'Fried chicken', '순살치킨', '无骨炸鸡'),
      desc: L('Poulet frit sans os', 'Boneless fried chicken', '뼈 없는 치킨', '无骨炸鸡'),
      price: 12500,
    },
    {
      name: L('Poulet frit sauce épicée', 'Yangnyeom fried chicken', '양념치킨', '韩式甜辣炸鸡'),
      desc: L('Poulet frit nappé d’une sauce sucrée et épicée', 'Fried chicken coated in a sweet and spicy sauce', '달콤매콤한 양념을 입힌 치킨', '裹甜辣酱的炸鸡'),
      price: 7500,
    },
    { name: L('Côtes de porc frites', 'Fried pork ribs', '돼지갈비 튀김', '炸猪排骨'), price: 8000 },
    {
      name: L('Donkkasseu', 'Donkatsu (pork cutlet)', '돈까스', '韩式炸猪排'),
      desc: L('Escalope de porc panée', 'Breaded pork cutlet', '돼지고기 커틀릿', '裹粉炸猪排'),
      price: 8000,
    },
    {
      name: L('Beef Gasseu', 'Beef cutlet', '비프까스', '炸牛排'),
      desc: L('Escalope de bœuf panée', 'Breaded beef cutlet', '소고기 커틀릿', '裹粉炸牛排'),
      price: 8000,
    },
    {
      name: L('Saengseon Gasseu', 'Fish cutlet', '생선까스', '炸鱼排'),
      desc: L('Filet de poisson pané', 'Breaded fish fillet', '생선 커틀릿', '裹粉炸鱼排'),
      price: 8000,
    },
    {
      name: L('Chicken Gasseu', 'Chicken cutlet', '치킨까스', '炸鸡排'),
      desc: L('Escalope de poulet panée', 'Breaded chicken cutlet', '닭고기 커틀릿', '裹粉炸鸡排'),
      price: 8000,
    },
    {
      name: L('Modum Gasseu A', 'Mixed cutlet A', '모듬까스 A', '炸排拼盘 A'),
      desc: L('Porc, poulet et poisson', 'Pork, chicken and fish', '돈까스, 치킨까스, 생선까스', '猪排、鸡排、鱼排'),
      price: 10000,
    },
    {
      name: L('Modum Gasseu B', 'Mixed cutlet B', '모듬까스 B', '炸排拼盘 B'),
      desc: L('Bœuf, poulet et poisson', 'Beef, chicken and fish', '비프까스, 치킨까스, 생선까스', '牛排、鸡排、鱼排'),
      price: 10000,
    },
    {
      name: L('Crevettes à la crème', 'Cream prawns', '크림새우', '奶油虾球'),
      desc: L('Crevettes frites, sauce crémeuse', 'Fried prawns in a creamy sauce', '크림소스를 곁들인 새우튀김', '炸虾配奶油酱'),
      price: 9500,
      isNew: true,
    },
    {
      name: L('Ailes de poulet kanpung', 'Kanpung chicken wings', '깐풍윙', '干烹鸡翅'),
      desc: L(
        'Six ailes de poulet frites, sauce sucrée légèrement pimentée',
        'Six fried chicken wings in a sweet, mildly spicy sauce',
        '매콤달콤한 소스의 닭날개 튀김 (6개)',
        '甜辣酱炸鸡翅（6只）',
      ),
      price: 7500,
      spicy: 1,
      isNew: true,
    },
  ],

  riz_ragout: [
    {
      name: L('Bibimbap', 'Bibimbap', '비빔밥', '韩式拌饭'),
      desc: L('Riz garni de légumes et de bœuf, à mélanger', 'Rice topped with vegetables and beef, to be mixed', '야채와 소고기를 올린 비빔밥', '米饭配蔬菜和牛肉，拌匀食用'),
      price: 7500,
      spicy: 1,
    },
    {
      name: L('Bibimbap en marmite de pierre', 'Stone pot bibimbap', '돌솥비빔밥', '石锅拌饭'),
      desc: L('Servi grésillant dans une marmite en pierre chaude', 'Served sizzling in a hot stone pot', '뜨거운 돌솥에 담아내는 비빔밥', '盛于滚烫石锅中'),
      price: 8000,
      spicy: 1,
    },
    {
      name: L('Ragoût de kimchi', 'Kimchi stew', '김치찌개', '泡菜汤'),
      desc: L('Au bœuf ou au porc', 'With beef or pork', '소고기 또는 돼지고기', '可选牛肉或猪肉'),
      price: 8000,
      spicy: 3,
    },
    {
      name: L('Ragoût de pâte de soja', 'Soybean paste stew', '된장찌개', '大酱汤'),
      desc: L(
        'Pâte de soja fermentée, légumes variés et crevettes',
        'Fermented soybean paste with vegetables and prawns',
        '야채와 새우를 넣은 된장찌개',
        '大酱配蔬菜和虾',
      ),
      price: 8000,
      spicy: 2,
    },
    {
      name: L('Ragoût de tofu soyeux', 'Soft tofu stew', '순두부찌개', '嫩豆腐汤'),
      desc: L('Relevé, au bœuf, au porc ou au calamar', 'Spicy, with beef, pork or squid', '소고기, 돼지고기 또는 오징어', '辣味，可选牛肉、猪肉或鱿鱼'),
      price: 8000,
      spicy: 3,
    },
    {
      name: L('Bulgogi en marmite', 'Bulgogi hot pot', '뚝배기불고기', '砂锅烤牛肉'),
      desc: L('Servi frémissant dans une marmite en terre', 'Served bubbling in an earthenware pot', '뚝배기에 끓여 내는 불고기', '盛于砂锅中'),
      price: 8500,
    },
    {
      name: L('Ragoût de saucisses aux vermicelles', 'Army stew with glass noodles', '당면 부대찌개', '粉条部队锅'),
      price: 8000,
      spicy: 2,
    },
    {
      name: L('Côte de porc mijotée', 'Braised pork ribs', '돼지등갈비찜', '炖猪排骨'),
      desc: L('Mijotée dans une sauce relevée', 'Braised in a spicy sauce', '매콤하게 조린 돼지 등갈비', '辣炖猪排骨'),
      price: 9500,
      spicy: 1,
    },
    {
      name: L('Soupe de mandu', 'Dumpling soup', '만두국', '饺子汤'),
      desc: L('Raviolis au bœuf en bouillon', 'Beef dumplings in broth', '소고기 만두국', '牛肉饺子汤'),
      price: 6500,
    },
    {
      name: L('Tteokbokki', 'Tteokbokki', '떡볶이', '韩式辣炒年糕'),
      desc: L('Gâteaux de riz mijotés dans une sauce pimentée', 'Rice cakes simmered in a spicy sauce', '매콤한 양념의 떡볶이', '辣酱炒年糕'),
      price: 8000,
      spicy: 3,
    },
    {
      name: L('Tofu kimchi', 'Tofu with kimchi', '두부김치', '豆腐泡菜'),
      desc: L('Tofu, kimchi et poitrine de porc sautée', 'Tofu with kimchi and stir-fried pork belly', '두부와 삼겹살 김치볶음', '豆腐配泡菜炒五花肉'),
      price: 12000,
      spicy: 2,
    },
    {
      name: L('Ragoût de saucisses', 'Army stew', '부대찌개', '部队锅'),
      desc: L('Saucisses et légumes', 'Sausages and vegetables', '소시지와 야채', '香肠与蔬菜'),
      price: 17000,
      spicy: 2,
    },
    { name: L('Galette de kimchi', 'Kimchi pancake', '김치전', '泡菜饼'), price: 7500, spicy: 1 },
    {
      name: L('Galette aux fruits de mer et oignon vert', 'Seafood and green onion pancake', '해물파전', '海鲜葱饼'),
      desc: L('Calamar et crevettes', 'Squid and prawns', '오징어, 새우', '鱿鱼和虾'),
      price: 7500,
    },
    {
      name: L('Yukgaejang', 'Yukgaejang', '육개장', '香辣牛肉汤'),
      desc: L('Soupe pimentée au bœuf effiloché et aux légumes', 'Spicy soup with shredded beef and vegetables', '소고기와 야채를 넣은 얼큰한 국', '辣味牛肉丝蔬菜汤'),
      price: 8500,
      spicy: 2,
    },
    {
      name: L('Galbitang', 'Galbitang', '왕갈비탕', '牛排骨汤'),
      desc: L('Bouillon clair de côtes de bœuf', 'Clear beef short rib soup', '소갈비를 푹 끓인 맑은 탕', '清炖牛排骨汤'),
      price: 11500,
      isNew: true,
    },
    {
      name: L('Samgyetang', 'Samgyetang', '삼계탕', '参鸡汤'),
      desc: L('Poulet entier en bouillon au ginseng', 'Whole chicken in ginseng broth', '인삼을 넣어 끓인 통닭', '人参整鸡汤'),
      price: 15000,
      isNew: true,
    },
  ],

  pate_nouilles: [
    {
      name: L('Nouilles de sarrasin froides', 'Cold buckwheat noodles', '메밀국수', '荞麦冷面'),
      desc: L('Servies dans un bouillon froid', 'Served in a cold broth', '시원한 육수의 메밀국수', '配冰凉汤汁'),
      price: 8000,
    },
    {
      name: L('Naengmyeon', 'Naengmyeon', '냉면', '韩式冷面'),
      desc: L(
        'Nouilles de sarrasin dans un bouillon froid et acidulé',
        'Buckwheat noodles in a cold, tangy broth',
        '새콤하고 시원한 육수의 냉면',
        '酸爽冰凉汤底荞麦面',
      ),
      price: 8000,
    },
    {
      name: L('Naengmyeon pimenté', 'Spicy naengmyeon', '비빔냉면', '韩式拌冷面'),
      desc: L(
        'Nouilles de sarrasin froides, sauce acidulée et pimentée',
        'Cold buckwheat noodles in a tangy, spicy sauce',
        '새콤매콤한 양념의 비빔냉면',
        '酸辣冷拌荞麦面',
      ),
      price: 8000,
      spicy: 3,
    },
    {
      name: L('Jaengban-guksu', 'Jaengban guksu', '쟁반국수', '大盘拌面'),
      desc: L(
        'Nouilles et légumes mêlés à une sauce au piment',
        'Noodles tossed with vegetables in a chilli sauce',
        '야채와 매콤한 양념에 비빈 국수',
        '蔬菜辣酱拌面',
      ),
      price: 8000,
      spicy: 3,
    },
    {
      name: L('Japchae (vermicelles sautés)', 'Japchae (stir-fried glass noodles)', '잡채', '韩式炒粉丝'),
      desc: L(
        'Aux légumes et au bœuf, ou aux crevettes et au calamar',
        'With vegetables and beef, or with prawns and squid',
        '소고기 잡채 또는 해물 잡채',
        '蔬菜牛肉或鲜虾鱿鱼',
      ),
      price: [{ value: 7500 }, { value: 8500 }],
    },
    {
      name: L('Jajangmyeon', 'Jajangmyeon', '짜장면', '韩式炸酱面'),
      desc: L(
        'Nouilles à la sauce de soja noire fermentée et au bœuf',
        'Noodles in fermented black bean sauce with beef',
        '소고기 짜장면',
        '黑豆酱牛肉面',
      ),
      price: 7000,
    },
    {
      name: L('Jjamppong blanc', 'White jjamppong', '백짬뽕', '海鲜清汤面'),
      desc: L(
        'Soupe de fruits de mer non pimentée, avec nouilles, vermicelles ou riz',
        'Mild seafood soup with noodles, glass noodles or rice',
        '맵지 않은 해물 짬뽕 (면, 당면 또는 밥)',
        '不辣海鲜汤，可选面条、粉丝或米饭',
      ),
      price: 9000,
    },
    {
      name: L('Jjamppong pimenté', 'Spicy jjamppong', '짬뽕', '韩式海鲜辣汤面'),
      desc: L(
        'Soupe de fruits de mer pimentée, avec nouilles, vermicelles ou riz',
        'Spicy seafood soup with noodles, glass noodles or rice',
        '얼큰한 해물 짬뽕 (면, 당면 또는 밥)',
        '辣味海鲜汤，可选面条、粉丝或米饭',
      ),
      price: 9000,
      spicy: 4,
    },
    {
      name: L('Udon tempura', 'Prawn tempura udon', '튀김우동', '炸虾乌冬面'),
      desc: L('Soupe de nouilles udon aux beignets de crevettes', 'Udon noodle soup with prawn tempura', '새우튀김을 올린 우동', '乌冬汤面配炸虾'),
      price: 9000,
    },
    {
      name: L('Kalguksu', 'Kalguksu', '닭칼국수', '鸡肉刀切面'),
      desc: L('Nouilles coupées au couteau, en bouillon de poulet', 'Knife-cut noodles in chicken broth', '닭 육수에 끓인 칼국수', '鸡汤刀切面'),
      price: 8000,
    },
  ],

  supplements: [
    { name: L('Bol de riz', 'Bowl of rice', '공기밥', '白米饭'), price: 1000, veg: true },
    { name: L('Tofu', 'Tofu', '두부', '豆腐'), price: 2000, veg: true },
    { name: L('Nouilles nature', 'Plain noodles', '소면사리', '面条'), price: 1500, veg: true },
    { name: L('Frites', 'Fries', '감자튀김', '薯条'), price: 1500, veg: true },
    { name: L('Accompagnement (banchan)', 'Side dish (banchan)', '반찬', '韩式小菜'), price: 1500, perPlate: true },
    { name: L('Kimchi', 'Kimchi', '김치', '韩式泡菜'), price: 2500, perPlate: true, spicy: 2 },
    {
      name: L('Œufs à la vapeur', 'Steamed eggs', '계란찜', '韩式蒸蛋'),
      desc: L('Œufs cuits à la vapeur, à la coréenne', 'Korean-style steamed eggs', '부드러운 계란찜', '韩式鸡蛋羹'),
      price: 4000,
    },
    {
      name: L('Ramyeon', 'Ramyeon', '라면', '韩国拉面'),
      desc: L('Nouilles instantanées coréennes', 'Korean instant noodles', '인스턴트 라면', '韩国方便面'),
      price: 5000,
      spicy: 3,
    },
    {
      name: L('Riz cantonais aux fruits de mer', 'Seafood fried rice', '해물야채볶음밥', '海鲜蔬菜炒饭'),
      desc: L('Crevettes, calamar et légumes', 'Prawns, squid and vegetables', '새우, 오징어, 야채', '虾仁、鱿鱼、蔬菜'),
      price: 5500,
    },
    {
      name: L('Riz cantonais au bœuf', 'Beef fried rice', '소고기야채볶음밥', '牛肉蔬菜炒饭'),
      desc: L('Bœuf et légumes', 'Beef and vegetables', '소고기, 야채', '牛肉、蔬菜'),
      price: 5500,
    },
    {
      name: L('Riz cantonais au kimchi', 'Kimchi fried rice', '해물김치볶음밥', '海鲜泡菜炒饭'),
      desc: L('Crevettes, calamar et kimchi', 'Prawns, squid and kimchi', '새우, 오징어, 김치', '虾仁、鱿鱼、泡菜'),
      price: 6500,
      spicy: 2,
    },
  ],
};

const meta: Omit<Category, 'dishes'>[] = [
  {
    id: 'barbecue',
    title: { fr: 'Barbecue coréen', en: 'Korean barbecue', ko: '한국식 바베큐', zh: '韩式烤肉' },
    intro: {
      fr: 'À griller à votre table barbecue, avec sauces et accompagnements.',
      en: 'Grilled at your barbecue table, with sauces and accompaniments.',
      ko: '바베큐 테이블에서 직접 구워 소스, 곁들임과 함께 즐기세요.',
      zh: '在烤肉餐桌上现烤，配以酱料和小菜。',
    },
    image: bbq,
    imageAlt: {
      fr: 'Poitrine de porc sur un grill de table, entourée de banchan',
      en: 'Pork belly on a table grill surrounded by banchan',
      ko: '반찬에 둘러싸인 테이블 그릴 위 삼겹살',
      zh: '桌上烤架上的五花肉，周围摆满小菜',
    },
  },
  {
    id: 'entree',
    title: { fr: 'Entrées & kimbap', en: 'Starters & kimbap', ko: '전채 & 김밥', zh: '前菜与紫菜包饭' },
    intro: {
      fr: 'Salades, fritures et kimbap roulés à la minute.',
      en: 'Salads, fried starters and kimbap rolled to order.',
      ko: '샐러드, 튀김, 그리고 주문 즉시 마는 김밥.',
      zh: '沙拉、炸物及现点现卷的紫菜包饭。',
    },
    image: kimbap,
    imageAlt: {
      fr: 'Tranches de kimbap sur une planche en bois',
      en: 'Slices of kimbap on a wooden board',
      ko: '나무 도마 위의 김밥',
      zh: '木板上的紫菜包饭',
    },
  },
  {
    id: 'specialite',
    title: { fr: 'Sushi & spécialités', en: 'Sushi & specialities', ko: '초밥 & 특선', zh: '寿司与特色菜' },
    intro: {
      fr: 'Sushi, sashimi, maki et plateaux à partager.',
      en: 'Sushi, sashimi, maki and platters to share.',
      ko: '초밥, 회, 마끼, 그리고 함께 나누는 모듬.',
      zh: '寿司、刺身、卷寿司及分享拼盘。',
    },
    image: sushi,
    imageAlt: {
      fr: 'Assortiment de sushi, sashimi et kimbap sur une ardoise',
      en: 'Assorted sushi, sashimi and kimbap on a slate',
      ko: '석판 위의 초밥, 회, 김밥 모듬',
      zh: '石板上的寿司、刺身和紫菜包饭拼盘',
    },
    raw: true,
  },
  {
    id: 'grillade_saute',
    title: { fr: 'Grillades & sautés', en: 'Grills & stir-fries', ko: '구이 & 볶음', zh: '烧烤与炒菜' },
    intro: {
      fr: 'Viandes, poissons et fruits de mer grillés ou sautés, doux ou relevés.',
      en: 'Grilled or stir-fried meat, fish and seafood, mild or spicy.',
      ko: '고기, 생선, 해산물 구이와 볶음 — 순한 맛부터 매운맛까지.',
      zh: '烤制或翻炒的肉类、鱼类与海鲜，口味有清淡也有香辣。',
    },
    image: grillade,
    imageAlt: {
      fr: 'Assiette de grillades : côtelettes, poulet, bœuf sauté et kimchi',
      en: 'Grill platter: chops, chicken, stir-fried beef and kimchi',
      ko: '갈비, 닭고기, 소고기 볶음, 김치 구이 플레이트',
      zh: '烧烤拼盘：排骨、鸡肉、炒牛肉和泡菜',
    },
  },
  {
    id: 'friture',
    title: { fr: 'Fritures', en: 'Fried dishes', ko: '튀김', zh: '炸物' },
    intro: {
      fr: 'Poulet frit à la coréenne, escalopes panées et fritures croustillantes.',
      en: 'Korean fried chicken, breaded cutlets and crisp fried dishes.',
      ko: '한국식 치킨, 까스류, 바삭한 튀김 요리.',
      zh: '韩式炸鸡、炸排及各式酥脆炸物。',
    },
    image: friedChicken,
    imageAlt: {
      fr: 'Poulet frit à la coréenne nappé de sauce et de sésame',
      en: 'Korean fried chicken glazed with sauce and sesame',
      ko: '양념과 참깨를 올린 한국식 치킨',
      zh: '淋上酱汁撒上芝麻的韩式炸鸡',
    },
  },
  {
    id: 'riz_ragout',
    title: { fr: 'Riz & ragoûts', en: 'Rice & stews', ko: '밥 & 찌개', zh: '饭类与汤锅' },
    intro: {
      fr: 'Bibimbap, ragoûts mijotés, bouillons et galettes.',
      en: 'Bibimbap, slow-simmered stews, broths and pancakes.',
      ko: '비빔밥, 찌개, 탕, 그리고 전.',
      zh: '拌饭、炖汤、汤品及煎饼。',
    },
    image: bibimbap,
    imageAlt: {
      fr: 'Bibimbap en marmite de pierre surmonté d’un œuf',
      en: 'Stone pot bibimbap topped with an egg',
      ko: '달걀을 올린 돌솥비빔밥',
      zh: '铺着煎蛋的石锅拌饭',
    },
  },
  {
    id: 'pate_nouilles',
    title: { fr: 'Nouilles', en: 'Noodles', ko: '면류', zh: '面类' },
    intro: {
      fr: 'Nouilles froides ou chaudes, sautées ou en bouillon.',
      en: 'Cold or hot noodles, stir-fried or in broth.',
      ko: '차가운 면과 따뜻한 면, 볶음면과 국수.',
      zh: '冷面或热面，炒面或汤面。',
    },
    image: noodles,
    imageAlt: {
      fr: 'Bol de jjamppong aux fruits de mer',
      en: 'Bowl of seafood jjamppong',
      ko: '해물 짬뽕 한 그릇',
      zh: '一碗海鲜炒码面',
    },
  },
  {
    id: 'supplements',
    title: { fr: 'Suppléments', en: 'Sides & extras', ko: '추가 메뉴', zh: '加点' },
    intro: {
      fr: 'Riz, accompagnements et petits plats pour compléter le repas.',
      en: 'Rice, side dishes and small plates to complete your meal.',
      ko: '밥, 반찬, 곁들임 요리.',
      zh: '米饭、小菜及配菜。',
    },
    image: supplements,
    imageAlt: {
      fr: 'Riz en marmite, tofu, frites et accompagnements',
      en: 'Pot rice, tofu, fries and side dishes',
      ko: '솥밥, 두부, 감자튀김과 반찬',
      zh: '锅饭、豆腐、薯条和小菜',
    },
  },
];

export const menu: Category[] = meta.map((category) => ({ ...category, dishes: dishes[category.id] }));

export const newDishes = menu.flatMap((category) => category.dishes.filter((dish) => dish.isNew));

/** « Ouverture de barbecue », mise en avant sur la page d'accueil. */
export const bbqOpening = menu[0]?.dishes[0];
