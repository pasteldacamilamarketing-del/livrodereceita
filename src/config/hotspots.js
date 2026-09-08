export const tabHotspots = [
  { label: 'Tradicionais', targetPage: 3, x: 90.0, y: 5.0, width: 9.3, height: 16.8 },
  { label: 'Especiais', targetPage: 6, x: 90.0, y: 23.1, width: 9.3, height: 15.9 },
  { label: 'Premium', targetPage: 15, x: 90.0, y: 40.2, width: 9.3, height: 16.1 },
  { label: 'Feira', targetPage: 19, x: 90.0, y: 57.6, width: 9.3, height: 15.9 },
  { label: 'Doces', targetPage: 25, x: 90.0, y: 74.7, width: 9.3, height: 16.6 },
]

export const tocCategoryHotspots = [
  { label: 'Tradicionais', targetPage: 3, x: 13.5, y: 26.0, width: 55, height: 5.3 },
  { label: 'Especiais', targetPage: 6, x: 13.5, y: 31.3, width: 55, height: 5.1 },
  { label: 'Premium', targetPage: 15, x: 13.5, y: 36.6, width: 55, height: 5.0 },
  { label: 'Feira', targetPage: 19, x: 13.5, y: 41.8, width: 55, height: 5.0 },
  { label: 'Doces', targetPage: 25, x: 13.5, y: 47.0, width: 55, height: 5.0 },
  { label: 'Monte o Seu', targetPage: 26, x: 13.5, y: 52.1, width: 58, height: 5.2 },
]

export const tocRecipeHotspots = [
  { label: 'Cami Carne', targetPage: 3, x: 11.0, y: 65.1, width: 31.5, height: 2.7 },
  { label: 'Cami Carne com Queijo', targetPage: 3, x: 11.0, y: 68.0, width: 31.5, height: 2.7 },
  { label: 'Cami Queijo', targetPage: 4, x: 11.0, y: 70.9, width: 31.5, height: 2.7 },
  { label: 'Cami Pizza', targetPage: 4, x: 11.0, y: 73.8, width: 31.5, height: 2.7 },
  { label: 'Cami Bauru', targetPage: 5, x: 11.0, y: 76.7, width: 31.5, height: 2.7 },
  { label: 'Cami Calabresa com Queijo', targetPage: 5, x: 11.0, y: 79.6, width: 31.5, height: 2.7 },
  { label: 'Cami Carne à Parmegiana', targetPage: 6, x: 43.0, y: 65.1, width: 34, height: 2.7 },
  { label: 'Cami Costela', targetPage: 6, x: 43.0, y: 68.0, width: 34, height: 2.7 },
  { label: 'Cami Frango Puro', targetPage: 7, x: 43.0, y: 70.9, width: 34, height: 2.7 },
  { label: 'Cami Carne Seca com Queijo', targetPage: 7, x: 43.0, y: 73.8, width: 34, height: 2.7 },
  { label: 'Cami Palmito', targetPage: 8, x: 43.0, y: 76.7, width: 34, height: 2.7 },
  { label: 'Cami Palmito com Queijo', targetPage: 8, x: 43.0, y: 79.6, width: 34, height: 2.7 },
]

export const coverOpenHotspot = { label: 'Abrir caderno', targetPage: 2, x: 18, y: 21, width: 66, height: 35 }
export const coverSecretHotspot = { label: 'Detalhe do logo', x: 33, y: 3, width: 35, height: 18 }

export const photoHotspotsByPage = {}
for (let page = 3; page <= 25; page += 1) {
  photoHotspotsByPage[page] = [
    { x: 50, y: 31, width: 40, height: 26, label: `Ampliar foto 1 da página ${page}` },
    { x: 51, y: 57, width: 40, height: 27, label: `Ampliar foto 2 da página ${page}` },
  ]
}
photoHotspotsByPage[26] = [
  { x: 48, y: 34, width: 43, height: 35, label: 'Ampliar foto da página 26' },
]
