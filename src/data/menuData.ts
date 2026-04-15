import type { Lang } from '../i18n/translations';

export type MenuItem = {
  name: Record<Lang, string>;
  desc?: Record<Lang, string>;
  price: string;
  veg?: boolean;
  spicy?: number;
  image?: string;
};

export const menuData: Record<string, MenuItem[]> = {
  barbecue: [
    {
      name: { fr: 'Ouverture de Barbecue', ko: '바비큐 오프닝', en: 'BBQ Opening', zh: '烧烤套餐' },
      desc: {
        fr: '2 Barbecues au choix + Sauces divers + Salade d\'oignon vert + Choux blanc assaisonné + Salade',
        ko: '바비큐 2종 선택 + 다양한 소스 + 파절이 + 양배추장아찌 + 상추',
        en: '2 BBQ of your choice + Various sauces + Green onion salad + Seasoned cabbage + Salad',
        zh: '任选2种烤肉 + 各种酱料 + 葱沙拉 + 卷心酱菜 + 生菜',
      },
      price: '21 000 Fcfa',
      image: '/images/food/bbq.jpg',
    },
    {
      name: { fr: 'Poitrine de Porc', ko: '삼겹살', en: 'Pork Belly', zh: '五花肉' },
      desc: { fr: 'Samgyeopsal', ko: '삼겹살', en: 'Samgyeopsal', zh: '三层肉' },
      price: '8 500 Fcfa',
      image: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=400&h=300&fit=crop',
    },
    {
      name: { fr: 'Echine de Porc', ko: '돼지목살', en: 'Pork Neck', zh: '猪肩肉' },
      price: '8 500 Fcfa',
      image: 'https://images.unsplash.com/photo-1602491453631-e2a5ad90a131?w=400&h=300&fit=crop',
    },
    {
      name: { fr: 'Côte de Porc (assaisonné)', ko: '돼지갈비', en: 'Seasoned Pork Ribs', zh: '猪排' },
      price: '8 500 Fcfa',
    },
    {
      name: { fr: 'Filet de Boeuf', ko: '소고기', en: 'Beef Fillet', zh: '牛肉' },
      price: '8 500 Fcfa',
      image: 'https://images.unsplash.com/photo-1558030006-450675393462?w=400&h=300&fit=crop',
    },
    {
      name: { fr: 'Mouton (assaisonné)', ko: '양고기', en: 'Seasoned Mutton', zh: '羊肉串' },
      price: '8 500 Fcfa',
    },
    {
      name: { fr: 'Poulet grillé (assaisonné)', ko: '닭고기', en: 'Grilled Chicken (seasoned)', zh: '鸡' },
      price: '8 500 Fcfa',
    },
    {
      name: { fr: 'Salade d\'oignon vert', ko: '파절이', en: 'Green Onion Salad', zh: '凉拌大葱' },
      desc: { fr: 'Supplément', ko: '추가', en: 'Extra', zh: '追加' },
      price: '3 500 Fcfa',
    },
    {
      name: { fr: 'Choux blanc assaisonné', ko: '양배추장아찌', en: 'Seasoned White Cabbage', zh: '卷心酱菜' },
      desc: { fr: 'Supplément', ko: '추가', en: 'Extra', zh: '追加' },
      price: '1 500 Fcfa',
    },
    {
      name: { fr: 'Salade', ko: '상추', en: 'Salad', zh: '生菜' },
      desc: { fr: 'Supplément', ko: '추가', en: 'Extra', zh: '追加' },
      price: '1 000 Fcfa',
    },
  ],
  specialite: [
    {
      name: { fr: 'SEOUL Spécial (G)', ko: '스페셜 브릿지', en: 'SEOUL Special (G)', zh: '首尔特别套餐(大)' },
      desc: {
        fr: 'Assortiment de Sushi, Sashimi et Kimbap (32pcs)',
        ko: '스시, 사시미, 김밥 모듬 (32개)',
        en: 'Assortment of Sushi, Sashimi and Kimbap (32pcs)',
        zh: '寿司、生鱼片和紫菜卷饭拼盘 (32个)',
      },
      price: '54 500 Fcfa',
      image: '/images/food/sushi.jpg',
    },
    {
      name: { fr: 'SEOUL Spécial (P)', ko: '하우스 스페셜', en: 'SEOUL Special (P)', zh: '首尔特别套餐(小)' },
      desc: {
        fr: 'Assortiment de Sushi, Sashimi (18pcs)',
        ko: '스시, 사시미 모듬 (18개)',
        en: 'Assortment of Sushi, Sashimi (18pcs)',
        zh: '寿司、生鱼片拼盘 (18个)',
      },
      price: '30 500 Fcfa',
      image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400&h=300&fit=crop',
    },
    {
      name: { fr: 'KIMBAP Spécial', ko: '김밥 스페셜', en: 'KIMBAP Special', zh: '紫菜卷饭特别' },
      desc: {
        fr: 'Assortiment de 9 Kimbap',
        ko: '김밥 9종 모듬',
        en: 'Assortment of 9 Kimbap',
        zh: '9种紫菜卷饭拼盘',
      },
      price: '49 500 Fcfa',
      image: '/images/food/kimbap.jpg',
    },
    {
      name: { fr: 'Sushi Saumon', ko: '초밥(연어)', en: 'Salmon Sushi', zh: '三文鱼寿司' },
      desc: {
        fr: '2pcs: 4 500 · 5pcs: 9 000 · 10pcs: 17 000',
        ko: '2개: 4 500 · 5개: 9 000 · 10개: 17 000',
        en: '2pcs: 4,500 · 5pcs: 9,000 · 10pcs: 17,000',
        zh: '2个: 4 500 · 5个: 9 000 · 10个: 17 000',
      },
      price: 'Dès 4 500 Fcfa',
      image: 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=400&h=300&fit=crop',
    },
    {
      name: { fr: 'Sashimi Saumon', ko: '회(연어)', en: 'Salmon Sashimi', zh: '三文鱼生鱼片' },
      desc: {
        fr: '4pcs: 6 500 · 15pcs: 20 500',
        ko: '4개: 6 500 · 15개: 20 500',
        en: '4pcs: 6,500 · 15pcs: 20,500',
        zh: '4个: 6 500 · 15个: 20 500',
      },
      price: 'Dès 6 500 Fcfa',
      image: 'https://images.unsplash.com/photo-1535399831218-d5bd36d1a6b3?w=400&h=300&fit=crop',
    },
    {
      name: { fr: 'Rouleau de saumon', ko: '연어 롤', en: 'Salmon Roll', zh: '三文鱼卷' },
      desc: { fr: '5pcs', ko: '5개', en: '5pcs', zh: '5个' },
      price: '9 500 Fcfa',
    },
    {
      name: { fr: 'Topping Kimbap Saumon', ko: '연어토핑김밥', en: 'Salmon Topping Kimbap', zh: '三文鱼卷' },
      desc: { fr: '8pcs', ko: '8개', en: '8pcs', zh: '8个' },
      price: '13 000 Fcfa',
    },
    {
      name: { fr: 'Sushi Poisson blanc', ko: '흰살생선 초밥', en: 'White Fish Sushi', zh: '白鱼寿司' },
      desc: { fr: '2pcs', ko: '2개', en: '2pcs', zh: '2个' },
      price: '4 000 Fcfa',
    },
    {
      name: { fr: 'Sushi Anguille', ko: '장어 초밥', en: 'Eel Sushi', zh: '鳗鱼寿司' },
      desc: { fr: '2pcs', ko: '2개', en: '2pcs', zh: '2个' },
      price: '5 000 Fcfa',
    },
    {
      name: { fr: 'Sushi Tofu frit', ko: '유부 초밥', en: 'Fried Tofu Sushi', zh: '炸豆腐寿司' },
      desc: { fr: '2pcs', ko: '2개', en: '2pcs', zh: '2个' },
      price: '5 000 Fcfa',
    },
    {
      name: { fr: 'Sashimi Poisson blanc', ko: '흰살생선 회', en: 'White Fish Sashimi', zh: '白鱼生鱼片' },
      desc: { fr: '4pcs', ko: '4개', en: '4pcs', zh: '4个' },
      price: '5 000 Fcfa',
    },
    {
      name: { fr: 'Sashimi Anguille', ko: '장어 회', en: 'Eel Sashimi', zh: '鳗鱼生鱼片' },
      desc: { fr: '4pcs', ko: '4개', en: '4pcs', zh: '4个' },
      price: '9 500 Fcfa',
    },
    {
      name: { fr: 'Salade au poisson cru', ko: '회무침', en: 'Raw Fish Salad', zh: '凉拌生鱼片' },
      desc: {
        fr: 'Poisson cru mélangé avec des légumes et assaisonné à la sauce piquante',
        ko: '생선회와 야채를 매운 소스로 버무린 샐러드',
        en: 'Raw fish mixed with vegetables and seasoned with spicy sauce',
        zh: '生鱼片混合蔬菜，配以辣酱调味',
      },
      price: '13 000 Fcfa',
      spicy: 2,
    },
    {
      name: { fr: 'Bibimbap au poisson cru', ko: '회덮밥', en: 'Raw Fish Bibimbap', zh: '生鱼片盖饭' },
      desc: {
        fr: 'Riz aux salades variées et poisson cru mélangé avec sauce piquante',
        ko: '다양한 샐러드와 생선회를 매운 소스와 함께 비빈 밥',
        en: 'Rice with mixed salads and raw fish with spicy sauce',
        zh: '各种沙拉和生鱼片配辣酱拌饭',
      },
      price: '10 500 Fcfa',
      spicy: 2,
    },
  ],
  entree: [
    {
      name: { fr: 'Salade d\'oignon vert', ko: '파절이', en: 'Green Onion Salad', zh: '凉拌大葱' },
      price: '3 500 Fcfa', veg: true, spicy: 1,
    },
    {
      name: { fr: 'Salade Maison', ko: '하우스 샐러드', en: 'House Salad', zh: '特色菜' },
      price: '4 500 Fcfa', veg: true,
    },
    {
      name: { fr: 'Salade d\'avocats', ko: '아보카도샐러드', en: 'Avocado Salad', zh: '虾拌鳄梨' },
      desc: { fr: 'Salade d\'avocats crevettes', ko: '아보카도 새우 샐러드', en: 'Avocado shrimp salad', zh: '牛油果虾沙拉' },
      price: '7 500 Fcfa', veg: true,
    },
    {
      name: { fr: 'Rouleau de printemps', ko: '스프링롤', en: 'Spring Roll', zh: '润饼卷' },
      desc: { fr: 'Crêpe à base de farine de riz, farcie avec des légumes', ko: '쌀가루 크레이프에 채소를 넣은 롤', en: 'Rice flour crepe stuffed with vegetables', zh: '以米粉制成的薄饼，内夹蔬菜' },
      price: '5 000 Fcfa', veg: true,
    },
    {
      name: { fr: 'Salade de poulet', ko: '치킨샐러드', en: 'Chicken Salad', zh: '鸡肉沙拉' },
      desc: { fr: 'Salade de poulet frit', ko: '치킨 샐러드', en: 'Fried chicken salad', zh: '炸鸡沙拉' },
      price: '8 000 Fcfa',
    },
    {
      name: { fr: 'Salade de calamar et nouilles', ko: '오징어초무침', en: 'Squid & Noodle Salad', zh: '醋拌鱿鱼' },
      desc: { fr: 'Calamar mélangé à des légumes vinaigrés', ko: '오징어와 야채를 식초 소스로 버무린 샐러드', en: 'Squid mixed with vinaigrette vegetables', zh: '鱿鱼混合醋味蔬菜' },
      price: '8 500 Fcfa', spicy: 3,
    },
    {
      name: { fr: 'Beignets de crevette', ko: '새우튀김', en: 'Shrimp Fritters', zh: '炸大虾' },
      desc: { fr: 'Friture de crevette', ko: '새우 튀김', en: 'Deep-fried shrimp', zh: '炸虾' },
      price: '7 000 Fcfa',
    },
    {
      name: { fr: 'Calamar Frit', ko: '오징어튀김', en: 'Fried Squid', zh: '炸鱿鱼' },
      desc: { fr: 'Friture de calamar', ko: '오징어 튀김', en: 'Deep-fried squid', zh: '炸鱿鱼' },
      price: '7 000 Fcfa',
    },
    {
      name: { fr: 'Nems au poulet / légume', ko: '닭고기넴 / 야채넴', en: 'Chicken / Veggie Spring Rolls', zh: '鸡肉春卷 / 蔬菜春卷' },
      desc: { fr: 'Friture de nems au poulet / légume', ko: '닭고기/야채 넴 튀김', en: 'Fried chicken or veggie rolls', zh: '炸鸡肉/蔬菜春卷' },
      price: '5 000 Fcfa', veg: true,
    },
    {
      name: { fr: 'Mandu', ko: '만두', en: 'Mandu (Dumplings)', zh: '饺子(猪肉,牛肉)' },
      desc: { fr: 'Ravioli (Porc / Boeuf)', ko: '만두 (돼지/소)', en: 'Dumplings (Pork / Beef)', zh: '猪肉/牛肉水饺' },
      price: '5 500 Fcfa',
      image: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=400&h=300&fit=crop',
    },
    {
      name: { fr: 'Kimbap Thon', ko: '참치김밥', en: 'Tuna Kimbap', zh: '紫菜卷饭(金枪鱼)' },
      desc: { fr: 'Riz roulé avec des algues séchées au thon', ko: '참치 김밥', en: 'Seaweed rice roll with tuna', zh: '金枪鱼紫菜卷饭' },
      price: '7 500 Fcfa',
    },
    {
      name: { fr: 'Kimbap Bulgogui', ko: '불고기김밥', en: 'Bulgogi Kimbap', zh: '紫菜卷饭(烤肉)' },
      desc: { fr: 'Riz roulé avec des algues séchées au boeuf', ko: '불고기 김밥', en: 'Seaweed rice roll with beef', zh: '烤牛肉紫菜卷饭' },
      price: '7 500 Fcfa',
    },
    {
      name: { fr: 'Kimbap Poulet', ko: '닭불고기김밥', en: 'Chicken Kimbap', zh: '紫菜卷饭(鸡肉)' },
      desc: { fr: 'Riz roulé avec des algues séchées au poulet', ko: '닭고기 김밥', en: 'Seaweed rice roll with chicken', zh: '鸡肉紫菜卷饭' },
      price: '8 500 Fcfa',
    },
    {
      name: { fr: 'Kimbap Avocat-Crevette', ko: '아보카새우김밥', en: 'Avocado-Shrimp Kimbap', zh: '紫菜卷饭(牛油果虾)' },
      desc: { fr: 'Riz roulé avec des algues séchées au crevette', ko: '아보카도 새우 김밥', en: 'Seaweed rice roll with avocado & shrimp', zh: '牛油果虾紫菜卷饭' },
      price: '8 500 Fcfa',
    },
    {
      name: { fr: 'Kimbap Surimi au Fromage', ko: '치즈맛살김밥', en: 'Surimi Cheese Kimbap', zh: '芝士紫菜卷饭' },
      desc: { fr: 'Riz roulé avec des algues séchées au fromage', ko: '치즈맛살 김밥', en: 'Seaweed rice roll with surimi & cheese', zh: '芝士蟹柳紫菜卷饭' },
      price: '8 500 Fcfa',
    },
    {
      name: { fr: 'Kimbap Dragon', ko: '드래곤김밥', en: 'Dragon Kimbap', zh: '龙紫菜卷饭' },
      desc: { fr: 'Riz roulé avec viande panée (Poulet, Porc, Boeuf)', ko: '튀김고기 김밥 (닭, 돼지, 소)', en: 'Rice roll with breaded meat', zh: '裹面包屑肉类紫菜卷饭' },
      price: '8 500 Fcfa', spicy: 1,
    },
    {
      name: { fr: 'Kimbap Dragon Crevette', ko: '드래곤새우김밥', en: 'Dragon Shrimp Kimbap', zh: '龙虾紫菜卷饭' },
      desc: { fr: 'Riz roulé avec crevette frit', ko: '새우튀김 김밥', en: 'Rice roll with fried shrimp', zh: '炸虾紫菜卷饭' },
      price: '9 000 Fcfa', spicy: 1,
    },
    {
      name: { fr: 'Kimbap Saumon', ko: '연어김밥', en: 'Salmon Kimbap', zh: '三文鱼紫菜卷饭' },
      desc: { fr: 'Riz roulé avec des algues séchées au saumon', ko: '연어 김밥', en: 'Seaweed rice roll with salmon', zh: '三文鱼紫菜卷饭' },
      price: '14 000 Fcfa',
    },
  ],
  grillade_saute: [
    {
      name: { fr: 'Mouton grillé', ko: '양구이', en: 'Grilled Mutton', zh: '烤羊肉' },
      desc: { fr: 'Mouton grillé à la sauce de Cumin', ko: '쿠민 소스 양고기 구이', en: 'Cumin sauce grilled mutton', zh: '孜然酱烤羊肉' },
      price: '9 000 Fcfa',
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop',
    },
    {
      name: { fr: 'Poulet grillé', ko: '닭구이', en: 'Grilled Chicken', zh: '烤鸡' },
      price: '9 000 Fcfa',
      image: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=400&h=300&fit=crop',
    },
    {
      name: { fr: 'Côte de porc grillé', ko: '돼지갈비구이', en: 'Grilled Pork Ribs', zh: '烤猪排' },
      desc: { fr: 'Côtes de porc marinées à la sauce de soja et grillées', ko: '간장 양념 돼지갈비 구이', en: 'Soy sauce marinated pork ribs', zh: '酱油腌制烤猪排' },
      price: '9 000 Fcfa',
      image: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=400&h=300&fit=crop',
    },
    {
      name: { fr: 'Poisson grillé', ko: '생선구이', en: 'Grilled Fish', zh: '烤鱼' },
      desc: { fr: 'Poisson grillé sur plaque chauffante', ko: '철판 생선 구이', en: 'Fish grilled on hot plate', zh: '铁板烤鱼' },
      price: '7 000 Fcfa',
    },
    {
      name: { fr: 'Barbecue porc pimenté', ko: '고추장 삼겹살구이', en: 'Spicy Pork BBQ', zh: '烤辣酱五花肉' },
      desc: { fr: 'Poitrine de porc marinée dans la pâte de piment coréenne et grillée', ko: '고추장에 재운 삼겹살 구이', en: 'Chili paste marinated pork belly, grilled', zh: '辣酱腌制五花肉烧烤' },
      price: '8 500 Fcfa', spicy: 2,
    },
    {
      name: { fr: 'Bulgogui', ko: '불고기', en: 'Bulgogi', zh: '烤牛肉' },
      desc: { fr: 'Viande de bœuf sautée aux légumes', ko: '소고기와 야채 볶음', en: 'Stir-fried beef with vegetables', zh: '蔬菜炒牛肉' },
      price: '7 500 Fcfa',
      image: 'https://images.unsplash.com/photo-1583224994076-066edc84face?w=400&h=300&fit=crop',
    },
    {
      name: { fr: 'Porc sauté piquant', ko: '제육볶음', en: 'Spicy Stir-fried Pork', zh: '辣炒猪肉' },
      desc: { fr: 'Poitrine de porc à la sauce piquante', ko: '매운 소스 돼지고기 볶음', en: 'Pork belly in spicy sauce', zh: '辣酱炒猪肉' },
      price: '8 000 Fcfa', spicy: 3,
    },
    {
      name: { fr: 'Kimchi Porc sauté', ko: '김치제육볶음', en: 'Kimchi Pork Stir-fry', zh: '炒泡菜猪肉' },
      desc: { fr: 'Porc sauté à la sauce piquante avec Kimchi', ko: '김치와 돼지고기 볶음', en: 'Pork stir-fried with Kimchi', zh: '泡菜炒猪肉' },
      price: '9 000 Fcfa', spicy: 3,
    },
    {
      name: { fr: 'Calamar sauté et Nouilles', ko: '오징어볶음', en: 'Stir-fried Squid & Noodles', zh: '辣炒鱿鱼' },
      desc: { fr: 'Calamar sauté avec légumes à la sauce piquante ou soja', ko: '오징어와 야채 볶음', en: 'Squid stir-fried with vegetables', zh: '鱿鱼炒蔬菜' },
      price: '8 500 Fcfa', spicy: 3,
    },
    {
      name: { fr: 'Crevettes au chili', ko: '칠리새우', en: 'Chili Shrimp', zh: '干烧虾仁' },
      desc: { fr: 'Crevettes sautées à la sauce au chili', ko: '칠리 소스 새우 볶음', en: 'Shrimp sautéed in chili sauce', zh: '辣椒酱炒虾' },
      price: '9 500 Fcfa',
    },
    {
      name: { fr: 'Tangsuyuk', ko: '탕수육', en: 'Tangsuyuk', zh: '韩式糖醋肉片' },
      desc: { fr: 'Porc pané et frit à la sauce aigre-douce', ko: '탕수육', en: 'Breaded pork in sweet & sour sauce', zh: '糖醋里脊' },
      price: '8 000 Fcfa',
    },
    {
      name: { fr: 'Poulet sauté piquant', ko: '닭갈비', en: 'Spicy Chicken Stir-fry', zh: '铁板鸡' },
      desc: { fr: 'Poulet sauté aux légumes', ko: '닭고기와 야채 볶음', en: 'Chicken stir-fried with vegetables', zh: '炒鸡肉蔬菜' },
      price: '9 500 Fcfa', spicy: 2,
    },
  ],
  friture: [
    {
      name: { fr: 'Beignets de poulet', ko: '닭강정', en: 'Chicken Nuggets', zh: '辣炸鸡丁' },
      desc: { fr: 'Beignets de morceaux de poulet à la sauce de soja', ko: '간장 소스 닭강정', en: 'Chicken pieces in soy sauce', zh: '酱油炸鸡块' },
      price: '7 500 Fcfa',
      image: '/images/food/fried-chicken.jpg',
    },
    {
      name: { fr: 'Fried chicken', ko: '순살치킨', en: 'Fried Chicken', zh: '无骨炸鸡' },
      desc: { fr: 'Poulet frit sans os', ko: '뼈 없는 치킨', en: 'Boneless fried chicken', zh: '无骨炸鸡' },
      price: '12 500 Fcfa',
      image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=400&h=300&fit=crop',
    },
    {
      name: { fr: 'Poulet frit épicé', ko: '양념치킨', en: 'Spicy Fried Chicken', zh: '调味炸鸡' },
      desc: { fr: 'Poulet frit dans une sauce épicée', ko: '매운 소스 양념 치킨', en: 'Chicken fried in spicy sauce', zh: '辣酱炸鸡' },
      price: '7 500 Fcfa',
      image: 'https://images.unsplash.com/photo-1575932444877-5106bee2a599?w=400&h=300&fit=crop',
    },
    {
      name: { fr: 'Côte de porc frit', ko: '돼지갈비튀김', en: 'Fried Pork Ribs', zh: '炸调味猪排' },
      desc: { fr: 'Friture de côte de porc', ko: '돼지갈비 튀김', en: 'Deep-fried pork ribs', zh: '炸猪排' },
      price: '8 000 Fcfa',
    },
    {
      name: { fr: 'Donkkasseu', ko: '돈가스', en: 'Donkatsu (Pork Cutlet)', zh: '炸猪排' },
      desc: { fr: 'Friture d\'escalope de Porc', ko: '돼지고기 돈가스', en: 'Deep-fried pork cutlet', zh: '炸猪排' },
      price: '8 000 Fcfa',
      image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=400&h=300&fit=crop',
    },
    {
      name: { fr: 'Beef Gasseu', ko: '비프가스', en: 'Beef Cutlet', zh: '炸牛排' },
      desc: { fr: 'Friture d\'escalope de Boeuf', ko: '소고기 가스', en: 'Deep-fried beef cutlet', zh: '炸牛排' },
      price: '8 000 Fcfa',
    },
    {
      name: { fr: 'Saengseon Gasseu', ko: '생선가스', en: 'Fish Cutlet', zh: '炸鱼排' },
      desc: { fr: 'Friture d\'escalope de Poisson', ko: '생선 가스', en: 'Deep-fried fish cutlet', zh: '炸鱼排' },
      price: '8 000 Fcfa',
    },
    {
      name: { fr: 'Chicken Gasseu', ko: '치킨가스', en: 'Chicken Cutlet', zh: '炸鸡排' },
      desc: { fr: 'Friture d\'escalope de Poulet', ko: '치킨 가스', en: 'Deep-fried chicken cutlet', zh: '炸鸡排' },
      price: '8 000 Fcfa',
    },
    {
      name: { fr: 'Modum Gasseu A', ko: '모듬가스 A', en: 'Mixed Cutlet A', zh: '三排拼盘(猪,鸡,鱼)' },
      desc: { fr: 'Assortiment de friture d\'escalope de Porc, Poulet et Poisson', ko: '돼지, 닭, 생선 모듬 가스', en: 'Assorted cutlets: Pork, Chicken, Fish', zh: '猪、鸡、鱼综合炸排' },
      price: '10 000 Fcfa',
    },
    {
      name: { fr: 'Modum Gasseu B', ko: '모듬가스 B', en: 'Mixed Cutlet B', zh: '三排拼盘(牛,鸡,鱼)' },
      desc: { fr: 'Assortiment de friture d\'escalope de Boeuf, Poulet et Poisson', ko: '소, 닭, 생선 모듬 가스', en: 'Assorted cutlets: Beef, Chicken, Fish', zh: '牛、鸡、鱼综合炸排' },
      price: '10 000 Fcfa',
    },
  ],
  riz_ragout: [
    {
      name: { fr: 'Bibimbap', ko: '비빔밥', en: 'Bibimbap', zh: '拌饭' },
      desc: { fr: 'Riz mélangé à des légumes, de la viande boeuf', ko: '야채와 소고기를 넣은 비빔밥', en: 'Mixed rice with vegetables and beef', zh: '蔬菜牛肉拌饭' },
      price: '7 500 Fcfa', veg: true, spicy: 1,
      image: '/images/food/bibimbap.jpg',
    },
    {
      name: { fr: 'Bibimbap chaud', ko: '돌솥비빔밥', en: 'Hot Stone Bibimbap', zh: '石锅拌饭' },
      desc: { fr: 'Bibimbap servi dans une marmite en pierre chaude', ko: '뜨거운 돌솥 비빔밥', en: 'Bibimbap in hot stone pot', zh: '石锅拌饭' },
      price: '8 000 Fcfa', veg: true, spicy: 1,
      image: 'https://images.unsplash.com/photo-1553163147-622ab57be1c7?w=400&h=300&fit=crop',
    },
    {
      name: { fr: 'Ragoût de Kimchi', ko: '김치찌개', en: 'Kimchi Stew', zh: '泡菜砂锅' },
      desc: { fr: 'Ragoût de chou pimenté et fermenté avec du boeuf ou du porc', ko: '김치찌개 (소/돼지)', en: 'Fermented cabbage stew with beef or pork', zh: '泡菜炖牛/猪肉' },
      price: '8 000 Fcfa', veg: true, spicy: 3,
      image: 'https://images.unsplash.com/photo-1498654896293-37aacf113fd9?w=400&h=300&fit=crop',
    },
    {
      name: { fr: 'Ragoût de pâte de soja', ko: '된장찌개', en: 'Soybean Paste Stew', zh: '大酱砂锅' },
      desc: { fr: 'Ragoût de pâte de soja fermenté accompagné de légumes variés et de crevette', ko: '된장찌개 (야채, 새우)', en: 'Fermented soybean paste stew with vegetables & shrimp', zh: '大酱汤配蔬菜和虾' },
      price: '8 000 Fcfa', veg: true, spicy: 2,
    },
    {
      name: { fr: 'Ragoût de Tofu mou', ko: '순두부찌개', en: 'Soft Tofu Stew', zh: '嫩豆腐砂锅' },
      desc: { fr: 'Ragoût de Tofu doux épicé avec du boeuf, du porc ou du calamar', ko: '순두부찌개 (소/돼지/오징어)', en: 'Spicy soft tofu stew with beef, pork, or squid', zh: '辣嫩豆腐汤' },
      price: '8 000 Fcfa', veg: true, spicy: 3,
    },
    {
      name: { fr: 'Bulgogui chaud', ko: '뚝배기불고기', en: 'Hot Pot Bulgogi', zh: '砂锅烤牛肉' },
      desc: { fr: 'Bulgogui servi dans une marmite en pierre chaude', ko: '뚝배기 불고기', en: 'Bulgogi served in hot stone pot', zh: '石锅烤牛肉' },
      price: '8 500 Fcfa',
    },
    {
      name: { fr: 'Ragoût de saucisses aux vermicelles', ko: '당면부대찌개', en: 'Sausage Stew w/ Noodles', zh: '火腿肠锅(粉条)' },
      desc: { fr: 'Ragoût de saucisses aux vermicelles', ko: '당면 부대찌개', en: 'Sausage stew with glass noodles', zh: '粉条火腿肠锅' },
      price: '8 000 Fcfa', spicy: 2,
    },
    {
      name: { fr: 'Côte de porc mijotée', ko: '돼지등갈비찜', en: 'Braised Pork Ribs', zh: '炖猪排骨' },
      desc: { fr: 'Côtelette de porc mijotée piquante', ko: '매운 돼지갈비찜', en: 'Spicy braised pork ribs', zh: '辣炖猪排骨' },
      price: '9 500 Fcfa', spicy: 1,
    },
    {
      name: { fr: 'Soupe de Mandu', ko: '만두국', en: 'Dumpling Soup', zh: '饺子汤(牛肉)' },
      desc: { fr: 'Soupe de ravioli au boeuf', ko: '소고기 만두국', en: 'Beef dumpling soup', zh: '牛肉饺子汤' },
      price: '6 500 Fcfa',
    },
    {
      name: { fr: 'Tteokbokki', ko: '떡볶이', en: 'Tteokbokki', zh: '辣炒年糕' },
      desc: { fr: 'Pâtes de riz composées de sauce piquante et différents ingrédients', ko: '매운 소스 떡볶이', en: 'Spicy rice cakes with various ingredients', zh: '辣酱炒年糕' },
      price: '8 000 Fcfa', veg: true, spicy: 3,
    },
    {
      name: { fr: 'Tofu Kimchi', ko: '두부김치', en: 'Tofu Kimchi', zh: '炒泡菜(加豆腐)' },
      desc: { fr: 'Pâté de soja accompagné de Kimchi et de poitrine de porc sautée', ko: '두부와 김치, 삼겹살 볶음', en: 'Tofu with Kimchi and sautéed pork belly', zh: '豆腐配泡菜和炒五花肉' },
      price: '12 000 Fcfa', spicy: 2,
    },
    {
      name: { fr: 'Ragoût de saucisses', ko: '부대찌개', en: 'Sausage Stew', zh: '泡菜香肠汤' },
      desc: { fr: 'Ragoût de saucisses avec légumes', ko: '부대찌개 (야채)', en: 'Sausage stew with vegetables', zh: '蔬菜香肠锅' },
      price: '17 000 Fcfa', spicy: 2,
    },
    {
      name: { fr: 'Galette de Kimchi', ko: '김치전', en: 'Kimchi Pancake', zh: '泡菜饼' },
      desc: { fr: 'Galette de Kimchi (chou pimenté et fermenté) haché', ko: '김치전', en: 'Kimchi pancake', zh: '泡菜煎饼' },
      price: '7 500 Fcfa', veg: true, spicy: 1,
    },
    {
      name: { fr: 'Galette d\'oignon vert', ko: '해물파전', en: 'Seafood Green Onion Pancake', zh: '海鲜葱煎饼' },
      desc: { fr: 'Galette de poireaux avec calamars et crevettes', ko: '해물파전 (오징어, 새우)', en: 'Leek pancake with squid and shrimp', zh: '韭菜鱿鱼虾煎饼' },
      price: '7 500 Fcfa', veg: true,
    },
    {
      name: { fr: 'Yukgaejang', ko: '육개장', en: 'Yukgaejang', zh: '香辣牛肉汤' },
      desc: { fr: 'Soupe piquante préparée avec du bœuf émincé et des légumes', ko: '소고기와 야채 육개장', en: 'Spicy beef and vegetable soup', zh: '辣牛肉蔬菜汤' },
      price: '8 500 Fcfa', spicy: 2,
    },
  ],
  pate_nouilles: [
    {
      name: { fr: 'Memilguksu (Nouilles Soba)', ko: '메밀국수', en: 'Buckwheat Noodles (Soba)', zh: '荞麦面条' },
      desc: { fr: 'Nouilles de sarrasin avec soupe froide', ko: '차가운 메밀국수', en: 'Buckwheat noodles with cold broth', zh: '荞麦冷面' },
      price: '8 000 Fcfa',
      image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop',
    },
    {
      name: { fr: 'Soupe froide de Nouilles', ko: '냉면', en: 'Cold Noodle Soup', zh: '冷面' },
      desc: { fr: 'Nouilles de sarrasin avec soupe acide et froide', ko: '냉면 (새콤한 국물)', en: 'Buckwheat noodles in cold & tangy broth', zh: '酸冷荞麦面' },
      price: '8 000 Fcfa',
      image: 'https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=400&h=300&fit=crop',
    },
    {
      name: { fr: 'Nouilles piquantes', ko: '비빔냉면', en: 'Spicy Noodles', zh: '拌冷面' },
      desc: { fr: 'Nouilles froides de sarrasin à la sauce acide et piquante', ko: '매운 비빔냉면', en: 'Cold buckwheat noodles with spicy sauce', zh: '酸辣冷面' },
      price: '8 000 Fcfa', veg: true, spicy: 3,
      image: '/images/food/noodles.jpg',
    },
    {
      name: { fr: 'Jaengban Guksu', ko: '쟁반국수', en: 'Jaengban Guksu', zh: '大盘荞麦面' },
      desc: { fr: 'Nouilles mélangées avec des légumes et assaisonnement à base de purée de piments', ko: '야채와 고추장 양념 쟁반국수', en: 'Noodles mixed with vegetables and chili paste', zh: '蔬菜辣酱拌面' },
      price: '8 000 Fcfa', spicy: 3,
    },
    {
      name: { fr: 'Vermicelles sautés', ko: '잡채', en: 'Stir-fried Glass Noodles', zh: '炒杂菜' },
      desc: { fr: 'Vermicelles sautés aux légumes et à la viande de bœuf ou aux crevettes et calamar', ko: '소고기/해물 잡채', en: 'Glass noodles stir-fried with vegetables and beef or seafood', zh: '蔬菜牛肉/海鲜炒粉丝' },
      price: '7 500 / 8 500 Fcfa', veg: true,
    },
    {
      name: { fr: 'Jajangmyeon', ko: '자장면', en: 'Jajangmyeon', zh: '炸酱面' },
      desc: { fr: 'Nouilles accompagnées d\'une sauce noire de soja fermenté avec viande bœuf', ko: '자장면 (소고기)', en: 'Noodles with fermented black bean sauce and beef', zh: '黑酱牛肉面' },
      price: '7 000 Fcfa',
    },
    {
      name: { fr: 'Jjamppong blanc', ko: '맑은짬뽕', en: 'White Jjamppong', zh: '海鲜不辣汤麺' },
      desc: { fr: 'Soupe de fruits de mer (Non Piquant) avec nouilles, vermicelles ou riz', ko: '맑은 해물 짬뽕 (안매운)', en: 'Seafood soup (non-spicy) with noodles or rice', zh: '海鲜清汤面（不辣）' },
      price: '9 000 Fcfa',
    },
    {
      name: { fr: 'Jjamppong piquant', ko: '매운짬뽕', en: 'Spicy Jjamppong', zh: '海鲜辣汤麺' },
      desc: { fr: 'Soupe de fruits de mer (Piquant) avec nouilles, vermicelles ou riz', ko: '매운 해물 짬뽕', en: 'Spicy seafood soup with noodles or rice', zh: '海鲜辣汤面' },
      price: '9 000 Fcfa', spicy: 4,
    },
    {
      name: { fr: 'Twiguim Udon', ko: '튀김우동', en: 'Tempura Udon', zh: '炸虾乌冬面' },
      desc: { fr: 'Soupe de nouilles aux beignets de crevette', ko: '새우튀김 우동', en: 'Udon soup with shrimp tempura', zh: '虾天妇罗乌冬面' },
      price: '9 000 Fcfa',
    },
    {
      name: { fr: 'Kalguksu', ko: '닭칼국수', en: 'Kalguksu', zh: '鸡丝刀切面' },
      desc: { fr: 'Soupe de nouilles au poulet', ko: '닭고기 칼국수', en: 'Chicken noodle soup', zh: '鸡肉刀切面汤' },
      price: '8 000 Fcfa',
    },
  ],
  supplements: [
    {
      name: { fr: 'Bol de riz', ko: '공기밥', en: 'Bowl of Rice', zh: '白米饭' },
      desc: { fr: 'Riz blanc', ko: '흰 쌀밥', en: 'White rice', zh: '白米饭' },
      price: '1 000 Fcfa', veg: true,
    },
    {
      name: { fr: 'Tofu', ko: '두부', en: 'Tofu', zh: '豆腐' },
      desc: { fr: 'Pâté de soja', ko: '두부', en: 'Soybean curd', zh: '豆腐' },
      price: '2 000 Fcfa', veg: true,
    },
    {
      name: { fr: 'Nouilles', ko: '소면', en: 'Noodles', zh: '龙须面' },
      desc: { fr: 'Nouilles cuites à l\'eau bouillante', ko: '삶은 소면', en: 'Boiled noodles', zh: '水煮面' },
      price: '1 500 Fcfa', veg: true,
    },
    {
      name: { fr: 'Frites', ko: '감자튀김', en: 'French Fries', zh: '炸薯条' },
      desc: { fr: 'Pommes de terre frites', ko: '감자 튀김', en: 'French fries', zh: '炸薯条' },
      price: '1 500 Fcfa', veg: true,
    },
    {
      name: { fr: 'Petit met', ko: '반찬', en: 'Side Dish', zh: '小菜' },
      desc: { fr: 'Plat d\'accompagnement', ko: '반찬 1접시', en: 'Side dish plate', zh: '配菜一盘' },
      price: '1 500 Fcfa/plat', veg: true,
    },
    {
      name: { fr: 'Kimchi', ko: '김치', en: 'Kimchi', zh: '泡菜' },
      desc: { fr: 'Chou pimenté et fermenté', ko: '김치', en: 'Fermented spicy cabbage', zh: '泡菜' },
      price: '2 500 Fcfa/plat', veg: true, spicy: 2,
    },
    {
      name: { fr: 'Omelette soufflée', ko: '계란찜', en: 'Steamed Egg Omelette', zh: '鸡蛋羹' },
      desc: { fr: 'Oeufs en cocotte cuits à la manière coréenne', ko: '계란찜', en: 'Korean-style steamed egg', zh: '韩式蒸蛋' },
      price: '4 000 Fcfa',
    },
    {
      name: { fr: 'Ramyeon', ko: '라면', en: 'Ramyeon', zh: '方便面' },
      desc: { fr: 'Nouilles instantanées', ko: '라면', en: 'Instant noodles', zh: '方便面' },
      price: '5 000 Fcfa', spicy: 3,
    },
    {
      name: { fr: 'Riz cantonais', ko: '해물야채볶음밥', en: 'Seafood Fried Rice', zh: '炒饭' },
      desc: { fr: 'Riz sauté avec des crevettes, des calamars et des légumes', ko: '해물 야채 볶음밥', en: 'Fried rice with shrimp, squid and vegetables', zh: '虾仁鱿鱼蔬菜炒饭' },
      price: '5 500 Fcfa', veg: true,
    },
    {
      name: { fr: 'Riz cantonais viande', ko: '소고기야채볶음밥', en: 'Beef Fried Rice', zh: '牛肉蔬菜炒饭' },
      desc: { fr: 'Riz sauté avec de la viande de bœuf et des légumes', ko: '소고기 야채 볶음밥', en: 'Fried rice with beef and vegetables', zh: '牛肉蔬菜炒饭' },
      price: '5 500 Fcfa',
    },
    {
      name: { fr: 'Riz cantonais Kimchi', ko: '해물김치볶음밥', en: 'Kimchi Fried Rice', zh: '泡菜炒饭' },
      desc: { fr: 'Riz sauté avec des crevettes, des calamars et du Kimchi', ko: '해물 김치 볶음밥', en: 'Fried rice with shrimp, squid and Kimchi', zh: '海鲜泡菜炒饭' },
      price: '6 500 Fcfa', veg: true, spicy: 2,
    },
  ],
};

export const categories = [
  { id: 'barbecue', labelKey: 'cat_barbecue' },
  { id: 'specialite', labelKey: 'cat_specialite' },
  { id: 'entree', labelKey: 'cat_entree' },
  { id: 'grillade_saute', labelKey: 'cat_grillade_saute' },
  { id: 'friture', labelKey: 'cat_friture' },
  { id: 'riz_ragout', labelKey: 'cat_riz_ragout' },
  { id: 'pate_nouilles', labelKey: 'cat_pate_nouilles' },
  { id: 'supplements', labelKey: 'cat_supplements' },
];
