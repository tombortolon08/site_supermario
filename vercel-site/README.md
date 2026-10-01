# Super Mário · site

Site estático (HTML + JS puro), pronto para a Vercel. Não precisa de build.

## Publicar
1. Acesse vercel.com → Add New → Project → arraste esta pasta (ou suba num repositório GitHub e importe).
2. Framework Preset: **Other**. Build Command: vazio. Output Directory: `.` (raiz).

## Trocar as fotos
Substitua os arquivos em `img/` mantendo exatamente o mesmo nome (ex.: `mil-folhas.jpg`).
Ideal: JPG, até ~1600 px no maior lado, qualidade 80%.

- `mascote-super-mario.png` e `logo-provisoria.png` ficam em PNG porque têm fundo transparente.

## Horários
Procure por `00h–00h` no `index.html` e no bloco `openingHoursSpecification` (schema.org) e atualize.
