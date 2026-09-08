export const pages = [
  { number: 1, file: '01_Capa.avif', section: 'Capa', title: 'Capa' },
  { number: 2, file: '02_Sumario.avif', section: 'Sumário', title: 'Sumário' },
  { number: 3, file: '03_Tradicionais_Cami_Carne_e_Cami_Carne_com_Queijo.avif', section: 'Tradicionais', title: 'Cami Carne e Cami Carne com Queijo' },
  { number: 4, file: '04_Tradicionais_Cami_Queijo_e_Cami_Pizza.avif', section: 'Tradicionais', title: 'Cami Queijo e Cami Pizza' },
  { number: 5, file: '05_Tradicionais_Cami_Bauru_e_Cami_Calabresa_com_Queijo.avif', section: 'Tradicionais', title: 'Cami Bauru e Cami Calabresa com Queijo' },
  { number: 6, file: '06_Especiais_Cami_Carne_a_Parmegiana_e_Cami_Costela.avif', section: 'Especiais', title: 'Cami Carne à Parmegiana e Cami Costela' },
  { number: 7, file: '07_Especiais_Cami_Frango_Puro_e_Cami_Carne_Seca_com_Queijo.avif', section: 'Especiais', title: 'Cami Frango Puro e Cami Carne Seca com Queijo' },
  { number: 8, file: '08_Especiais_Cami_Palmito_e_Cami_Palmito_com_Queijo.avif', section: 'Especiais', title: 'Cami Palmito e Cami Palmito com Queijo' },
  { number: 9, file: '09_Especiais_Cami_Carne_Seca_Catupiry_e_Cami_Palmito_com_Catupiry.avif', section: 'Especiais', title: 'Cami Carne Seca Catupiry e Cami Palmito com Catupiry' },
  { number: 10, file: '10_Especiais_Cami_Carne_com_Ovo_e_Cami_Bobo_de_Camarao.avif', section: 'Especiais', title: 'Cami Carne com Ovo e Cami Bobó de Camarão' },
  { number: 11, file: '11_Especiais_Cami_4_Queijos_e_Cami_Portuguesa.avif', section: 'Especiais', title: 'Cami 4 Queijos e Cami Portuguesa' },
  { number: 12, file: '12_Especiais_Cami_Frango_Catupiry_e_Cami_Caipira.avif', section: 'Especiais', title: 'Cami Frango Catupiry e Cami Caipira' },
  { number: 13, file: '13_Especiais_30cm_Cami_Especial_Carne_e_Cami_Especial_Frango.avif', section: 'Especiais', title: 'Cami Especial Carne e Cami Especial Frango — 30 cm' },
  { number: 14, file: '14_Especiais_30cm_Cami_Especial_Calabresa_e_Cami_Especial_Queijo.avif', section: 'Especiais', title: 'Cami Especial Calabresa e Cami Especial Queijo — 30 cm' },
  { number: 15, file: '15_Premium_Cami_Salmao_Premium_e_Cami_Angus_Premium.avif', section: 'Premium', title: 'Cami Salmão Premium e Cami Angus Premium' },
  { number: 16, file: '16_Premium_Cami_Lasanha_Premium_e_Cami_Moda_da_Carol.avif', section: 'Premium', title: 'Cami Lasanha Premium e Cami Moda da Carol' },
  { number: 17, file: '17_Premium_Cami_Moda_da_Camilla_e_Cami_Bacalhau_Premium.avif', section: 'Premium', title: 'Cami Moda da Camilla e Cami Bacalhau Premium' },
  { number: 18, file: '18_Premium_Cami_Camarao_Premium_e_Cami_Costela_Premium.avif', section: 'Premium', title: 'Cami Camarão Premium e Cami Costela Premium' },
  { number: 19, file: '19_Feira_Carne_com_Cheddar_e_Carne_com_Catupiry.avif', section: 'Feira', title: 'Carne com Cheddar e Carne com Catupiry' },
  { number: 20, file: '20_Feira_Carne_com_Azeitona_e_Queijo_com_Milho.avif', section: 'Feira', title: 'Carne com Azeitona e Queijo com Milho' },
  { number: 21, file: '21_Feira_Queijo_com_Cebola_e_Queijo_com_Bacon.avif', section: 'Feira', title: 'Queijo com Cebola e Queijo com Bacon' },
  { number: 22, file: '22_Feira_Calabresa_com_Catupiry_e_Frango_com_Queijo.avif', section: 'Feira', title: 'Calabresa com Catupiry e Frango com Queijo' },
  { number: 23, file: '23_Feira_Bacalhau_e_Escarola_com_Queijo.avif', section: 'Feira', title: 'Bacalhau e Escarola com Queijo' },
  { number: 24, file: '24_Feira_Brocolis_com_Queijo_e_Bobo_de_Camarao_Especial.avif', section: 'Feira', title: 'Brócolis com Queijo e Bobó de Camarão Especial' },
  { number: 25, file: '25_Doces_Doce_de_Leite_com_Coco_e_Doce_de_Leite_com_Banana.avif', section: 'Doces', title: 'Doce de Leite com Coco e Doce de Leite com Banana' },
  { number: 26, file: '26_Monte_o_Seu.avif', section: 'Monte o Seu', title: 'Monte o Seu' },
]

export const PAGE_COUNT = pages.length
export const getPage = (number) => pages.find((page) => page.number === number) || pages[0]
export const pageAsset = (page) => `./pages/${page.file}`
