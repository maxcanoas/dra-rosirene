# Spec · Site da Dra. Rosirene Gessinger

Protótipo de apresentação. HTML + CSS + JS vanilla, sem build, abre com duplo clique.
Raiz: `D:\Freelas\dra-rosirene`. Objetivo único: o paciente agendar pelo WhatsApp com confiança.

## 1. Decisões fechadas

| Tema | Decisão |
|---|---|
| JS | Scripts clássicos com `defer`, cada arquivo em escopo próprio. Sem JS, o conteúdo aparece inteiro. |
| Git | `git init` local na raiz, checkpoint depois da aprovação, um commit por fase. Sem remote. |
| Fontes | **Newsreader** (títulos) + **Source Sans 3** (corpo), via Google Fonts com preconnect e `display=swap`, carregadas sem bloquear a renderização. A Newsreader vem em dois cortes estáticos: peso 300 em tamanho óptico 72 (h1, h2, citações) e peso 400 em tamanho óptico 16 (h3, h4, marca, cards). Fallbacks locais com size-adjust medido, para a troca de fonte não mover o layout. |
| Voz | 1ª pessoa (a Dra.) no hero, nas citações, nos passos da consulta e em "Como eu vejo o cuidado". "O consultório" em agendamento, convênios e formulário. 3ª pessoa em títulos e menu. |
| Menu | Na home, âncoras. Nas internas, "A Dra. Rosirene" → sobre.html, "Atendimentos" → atendimentos.html, o resto → `index.html#…`. `aria-current="page"`. |
| Domínio | `https://[PREENCHER-DOMINIO]` em canonical, og, sitemap e JSON-LD. |
| CFM 2.336 | RQE sempre acompanhado da especialidade. Sem preço, promessa, superlativo, antes e depois ou depoimento. |
| WhatsApp | Mensagem pré-preenchida na voz do paciente. Header, menu e botão flutuante (componentes compartilhados) usam a genérica. Hero, contato, Aeroespacial e os CTAs de Sobre e Atendimentos têm texto próprio. Link `https://wa.me/55DDDNUMERO` marcado [PREENCHER]. |
| Revisão | humanizar-ui e humanizar aplicados direto. O briefing vence os conflitos, que ficam listados no relatório final. |

## 2. Direção visual

**Assinatura: o lambri.** As fotos dos consultórios têm paredes curvas, meia-parede verde-sálvia e
friso dourado fino. O site usa essa linguagem e nenhuma outra:
- **Canto de parede curva:** toda foto tem um único canto com raio grande, e o lado muda conforme a composição.
- **Friso:** linhas de 1px em champanhe separam blocos, e a faixa sálvia de seção alternada começa com esse friso.
- **Itálico** da Newsreader em uma palavra por título, no máximo.

Nada além disso decora a página.

### Paleta (contraste WCAG calculado)

| Token | Hex | Uso | Contraste |
|---|---|---|---|
| `--petrol` | `#1E3D3A` | títulos, header escuro, blocos de contraste | 10,66 sobre linho |
| `--petrol-deep` | `#152C2A` | rodapé | linho sobre ele: 13,33 |
| `--linen` | `#F7F3EE` | fundo principal | — |
| `--sage` | `#E4EAE2` | seções alternadas (o "lambri") | grafite 11,69 · cinza 5,75 |
| `--sage-deep` | `#B9C6B6` | bloco deslocado atrás da foto do hero (sem texto) | — |
| `--champagne` | `#C9A97C` | botão principal, frisos, ícones | petróleo sobre ele: 5,30 |
| `--champagne-ink` | `#7D6038` | pré-títulos e links sobre fundo claro | 5,28 sobre linho · 4,77 sobre sálvia |
| `--ink` | `#2C2A28` | texto | 12,94 sobre linho |
| `--ink-soft` | `#5E5850` | texto secundário | 6,36 sobre linho |
| `--on-dark-soft` | `#BFCBC6` | texto secundário sobre petróleo | 7,05 |

Champanhe puro nunca vira texto sobre claro (2,01). Sobre petróleo pode ser número e ícone (5,30).
Sem branco puro, sem degradê decorativo. O único degradê do site é o véu de petróleo sobre a
foto de Atendimentos, que existe para garantir contraste.

### Tipografia

- Base: **17px no mobile, 18px a partir de 768px**, entrelinha 1,65, parágrafo com no máximo 62ch.
- Escala: `--fs-small` 0,875rem (legendas, pré-título) · `--fs-body` 1rem · `--fs-lead` 1,1875rem ·
  `--fs-h4` clamp(1,25→1,375rem) · `--fs-h3` clamp(1,5→1,875rem) · `--fs-h2` clamp(2→3,25rem) ·
  `--fs-display` clamp(2,5→4,5rem), uma vez por página.
- Títulos em Newsreader com peso 350 a 400, `opsz` automático e `text-wrap: balance`.
  Corpo em Source Sans 3, 400/600.
- Pré-título: caixa alta com espaçamento de 0,14em, 0,875rem, `--champagne-ink`, no máximo 6 palavras.
- Nunca Inter, Roboto ou Arial. Fallback: Georgia / system-ui.

### Forma e espaço

- Container de 1240px, gutter clamp(20px, 5vw, 64px), grid de 12 colunas.
- Espaço: 0,5 · 1 · 1,5 · 2,5 · 4rem + três alturas de seção (S, M, L). O ritmo muda de propósito:
  a seção de prova respira mais que a de lista.
- Raios:
  - `--radius-curve` clamp(56px, 9vw, 140px), só nas fotos e sempre num canto só;
  - `--radius-card` 28px, num canto só;
  - `--radius-control` 6px, em botões e campos.
- Sombra: uma só, quente e leve (`0 8px 32px rgba(60,40,20,.08)`).
- Botões: principal em champanhe com texto petróleo, 600; secundário com borda de 1px em petróleo.
  Altura mínima de 48px.

## 3. Mapa de páginas

`index.html` · `sobre.html` · `atendimentos.html` · `politica-de-privacidade.html`
Header e rodapé idênticos nas quatro, conferidos com diff. Só muda o `aria-current`.

### index.html (fundo de cada seção entre colchetes)

1. **Header** [vidro]: nome em Newsreader + "Otorrinolaringologia · CRM-RS 16423" · menu (Início, A Dra. Rosirene,
   Atendimentos, Consultórios, Dúvidas, Contato) · "Agendar consulta".
   - Altura de 88px, que cai para 68px depois de 24px de rolagem (no celular, 72px e 64px).
   - No topo o header fica sobre o off-white liso, então aparece sem blur. O vidro entra ao rolar, com opacidade 0,86 para o texto secundário manter AA.
   - Menu horizontal a partir de 1200px. Abaixo disso vira painel lateral de vidro, e o botão do header
     aparece só a partir de 640px. Em telas menores ele fica dentro do painel.
2. **Hero** [linho + textura a 35%]
   ```
   [pré-título / H1 / parágrafo / 2 botões / 3 credenciais]  [bloco sálvia deslocado + foto 4:5, canto sup. dir.]
   ```
   - Pré-título: "Otorrinolaringologista em Gravataí e Porto Alegre"
   - H1: "Antes do exame, eu *escuto* você."
   - Parágrafo: "Atendo adultos, crianças e pilotos com queixas de ouvido, nariz e garganta. Você sai da
     consulta entendendo o que está acontecendo e quais são os próximos passos."
   - Botões: "Agendar pelo WhatsApp" · "Conhecer a Dra. Rosirene"
   - Credenciais: CRM-RS 16423 · RQE 7813 Otorrinolaringologia · RQE 44922 Medicina Aeroespacial
   - No mobile o texto vem primeiro, com o H1 e o botão principal visíveis na primeira tela, e a foto vem logo abaixo.
3. **Faixa de confiança** [petróleo]:
   - "30+" anos de prática clínica [CONFIRMAR], com contador;
   - "2" consultórios;
   - "2" especialidades com RQE (Otorrinolaringologia e Medicina Aeroespacial);
   - "Adultos e crianças" (Atendimento em todas as idades).
4. **A Dra. Rosirene** [linho]: a foto invade a faixa em 96px no desktop e 48px no celular, canto superior direito.
   - H2 "Quem vai cuidar de você", dois parágrafos em lorem.
   - Citação: "Gosto de encerrar a consulta só quando a pessoa entendeu tudo. Se precisar, explico de novo."
   - Link "Ler a trajetória completa".
5. **Atendimentos** [foto + véu petróleo]: H2 "O que eu atendo".
   - Intro: "Ouvido, nariz e garganta em todas as idades, e a avaliação de quem trabalha voando."
   - Seis cards de vidro em grid assimétrico:
   ```
   [H2 + intro (1–5)]        [Adulto (6–9)]        [Infantil (10–12), desce 72px]
   [Audição (1–5)]    [Ronco (6–8), desce 45px]   [Tontura (9–12), desce 72px]
               [Medicina Aeroespacial (4–12), largo]
   (Revisado após screenshots: o card alto de Infantil deixava vazio; alturas naturais em cascata.)
   ```
   Frases dos cards:
   - **Adulto:** "Sinusite, rinite, garganta que inflama sempre, rouquidão que não passa."
   - **Infantil:** "Otite de repetição, adenoide, amígdalas e a criança que respira pela boca."
   - **Audição e zumbido:** "Quando a TV precisa ficar mais alta ou o chiado no ouvido não deixa dormir."
   - **Ronco e sono:** "Ronco que incomoda quem dorme ao lado e pausas na respiração à noite."
   - **Tontura e labirintite:** "Tontura ao levantar, desequilíbrio e crises de vertigem."
   - **Medicina Aeroespacial:** "Avaliação otorrinolaringológica de pilotos e tripulantes."

   Link de cada card: "Ler mais", com o nome da área em texto só para leitor de tela.
6. **Como é a consulta** [linho]: H2 à esquerda, foto consulta-crianca à direita (canto superior esquerdo).
   Abaixo, uma linha do tempo de 4 passos: horizontal no desktop, vertical no mobile, com friso champanhe.
   A numeração é legítima, porque é uma sequência real.
   1. "Você me conta o que sente": "Sem pressa. Quando começou, o que piora, o que você já tentou."
   2. "Exame com calma e explicação": "Mostro o que estou vendo e explico cada etapa do exame."
   3. "Plano de cuidado combinado com você": "Decidimos juntos o tratamento, levando em conta a sua rotina."
   4. "Acompanhamento": "Marcamos o retorno, e você sabe como falar com o consultório se algo mudar."
7. **Consultórios** [sálvia com friso]: H2 "Onde eu atendo".
   - Dois blocos, Gravataí e Porto Alegre, o segundo 72px (4rem) mais abaixo. A galeria de vidro invade a seção Aeroespacial em 120px no desktop. Cada um tem foto, bairro,
     endereço e horários [PREENCHER], o botão "Ver no mapa" e um iframe com `src=""`, comentário e
     um painel "Mapa do consultório" por trás.
   - Um bloco de vidro menor com a galeria: "Recepção" e "Sala de exames".
8. **Medicina Aeroespacial** [petróleo]: pré-título "Medicina Aeroespacial · RQE 44922", H2 "Para quem
   trabalha voando", lorem, botão "Agendar avaliação aeroespacial". A foto sangra até a borda direita.
9. **Dúvidas frequentes** [linho]: H2 à esquerda com a nota "Não encontrou sua dúvida? Fale com o
   consultório." e o accordion à direita. As perguntas:
   - Preciso de encaminhamento para marcar?
   - Atende crianças a partir de que idade?
   - Quais convênios são aceitos?
   - Como funciona a avaliação para pilotos?
   - Quanto tempo dura a consulta?
   - Preciso levar algum exame?
10. **Instagram** [sálvia]: H2 "Acompanhe no Instagram" à esquerda e @drarosirenegessinger à direita.
    Grid 4×1 no desktop e 2×2 no mobile.
11. **Contato** [linho]: H2 "Fale com o consultório".
    - À esquerda: WhatsApp em destaque, telefone, e-mail e horários [PREENCHER].
    - À direita, o formulário: nome, telefone, cidade (duas opções grandes, Gravataí e Porto Alegre)
      e mensagem.
    - Aviso de LGPD: "Usamos seus dados só para responder a este contato." + link para a política.
    - Botão "Enviar mensagem". Confirmação: "Mensagem enviada. O consultório vai retornar no telefone
      que você informou."
12. **Rodapé** [petróleo profundo]: nome, CRM e os dois RQEs com especialidade, "Responsável técnica:
    Dra. Rosirene Gessinger", endereços resumidos, links, política e, por último, "Site desenvolvido
    por DEVMRMORAES".
13. **Botão flutuante** "Agendar": aparece depois que o hero sai da tela. É petróleo com ícone em
    linho, e o rótulo abre no hover no desktop. O "voltar ao topo" fica empilhado acima dele e aparece
    depois de 800px de rolagem.

### sobre.html

1. **Hero menor:** pré-título "Médica otorrinolaringologista · CRM-RS 16423", H1 "Rosirene Gessinger",
   foto sobre-dra.
2. **Trajetória:** lorem longo em quatro subtítulos (Formação · Residência e especialização ·
   Medicina Aeroespacial · Hoje). Ao lado de "Hoje" entra a foto instagram-3 (palestra).
3. **Alguns marcos:** linha do tempo vertical com 5 itens [PREENCHER] (ano + marco).
4. **Como eu vejo o cuidado** [sálvia]: citação grande em Newsreader itálico.
5. **Chamada final:** "Quer conversar sobre o que está sentindo?" + "Agendar pelo WhatsApp".

### atendimentos.html

1. **Hero menor:** pré-título "Atendimentos", H1 "Ouvido, nariz e garganta, em todas as idades",
   foto instagram-2 (mãos com otoscópio).
2. **Seis seções** alternando foto e texto de lado. Cada uma tem título real, lorem e a lista
   "Quando procurar" com 3 a 5 itens reais (a quantidade varia por área). O ícone de cada área
   aparece pequeno, ao lado do título.

   | Área | Foto |
   |---|---|
   | Otorrinolaringologia adulto | consultorio-sala |
   | Otorrinolaringologia infantil | consulta-crianca |
   | Audição e zumbido | consulta-atendimento |
   | Ronco e sono | instagram-1 |
   | Tontura e labirintite | instagram-4 |
   | Medicina Aeroespacial | aeroespacial (fundo petróleo) |

3. **Chamada final** para agendar.

### politica-de-privacidade.html

Header, H1 "Política de privacidade" e lorem nos subtítulos Quais dados coletamos · Como usamos ·
Seus direitos · Contato do responsável. Data "Atualizada em [PREENCHER]". Rodapé.

## 4. Efeitos

Todos são desligados com `prefers-reduced-motion: reduce`. Na dúvida, menos.

| Efeito | Onde | Comportamento |
|---|---|---|
| Reveal | cabeçalhos de seção, grupos (cards, passos, números, consultórios, Instagram) | opacity 0→1 + translateY 24px→0, 700ms, `cubic-bezier(.22,1,.36,1)`, uma vez só. Stagger de 80ms entre irmãos. Só vale com a classe `js` no `<html>`. **Não se aplica** ao hero, aos parágrafos soltos, ao FAQ, ao formulário e ao rodapé. |
| Parallax | textura do hero 0,08 · foto do hero 0,12 · bloco sálvia 0,18 · fundo de Atendimentos 0,15 · foto Aeroespacial 0,10 | rAF + `translate3d`. Só calcula quando a seção está na tela. `will-change` só nesses elementos. Desligado abaixo de 768px. A imagem tem sobra de altura para não abrir fresta. |
| Vidro | header (ao rolar), painel mobile, cards de Atendimentos, galeria dos consultórios. Cards e galeria usam opacidade 0,86, por terem texto de leitura sobre foto escura | `rgba(247,243,238,.65)` + `blur(16px) saturate(140%)` + borda `rgba(255,255,255,.5)` + a sombra quente. `@supports not` → fundo sólido com 96% de opacidade. |
| Header | ao rolar | 88px → 68px e borda inferior mais visível, com transição de 250ms. |
| Scroll suave | links de âncora | CSS `scroll-behavior` + `scroll-margin-top` na altura do header. O JS fecha o painel e move o foco para a seção. |
| Link ativo | menu da home | IntersectionObserver nas seções, faixa central da tela. |
| Contador | "30+" | 0→30 em 1400ms com ease-out, quando 50% visível, uma vez só. O HTML já traz o valor final. |
| Accordion | FAQ | `button[aria-expanded]` + região. Um item aberto por vez. A altura anima com `grid-template-rows` 0fr→1fr em 300ms. Todos começam fechados. |
| Hover de card | Atendimentos | sobe 4px e o friso champanhe vai de 32px para 64px, em 250ms. Só com `@media (hover: hover)`. |
| Zoom | Instagram | scale 1,04 em 600ms no hover. |
| Menu mobile | painel lateral à direita, min(88vw, 380px) | Esc fecha, foco preso dentro do painel, rolagem da página travada, overlay com leve escurecimento. |
| Formulário | contato | validação nativa + mensagem inline. A confirmação aparece numa região `aria-live` sem recarregar. |

## 4b. Performance

- `content-visibility: auto` nas seções abaixo da dobra (Atendimentos, Consulta, Dúvidas, Instagram, Contato), com alturas estimadas pela medição real. Ao fim de uma rolagem por âncora, o destino é reajustado.
- A textura do hero foi recomprimida de 250 KB para 79 KB. A diferença não aparece com 35% de opacidade.

## 5. Imagens (todas em `assets/img/`, WebP + JPG)

| Arquivo | Real | Uso | Carregamento |
|---|---|---|---|
| hero-dra | 928×1152 | hero da home | eager, `fetchpriority="high"` |
| sobre-dra | 928×1152 | seção Sobre, hero do sobre.html | lazy na home / eager no sobre |
| consulta-atendimento | 1312×816 | fundo de Atendimentos; Audição (atendimentos.html) | lazy |
| consulta-crianca | 1312×816 | Como é a consulta; Infantil | lazy |
| consultorio-gravatai | 1264×848 | bloco Gravataí | lazy |
| consultorio-portoalegre | 1264×848 | bloco Porto Alegre | lazy |
| consultorio-recepcao | 1312×816 | galeria | lazy |
| consultorio-sala | 1312×816 | galeria; Adulto | lazy |
| aeroespacial | 1312×816 | seção Aeroespacial | lazy |
| textura-fundo | 1376×768 | fundo do hero, opacidade 35% | CSS `image-set()` webp/jpg |
| instagram-1…4 | 1024×1024 | grid do Instagram; 1, 2, 3 e 4 também nas internas | lazy |
| og-image.jpg | 1424×752 | Open Graph | — |

Todas as `<img>` têm `width`/`height` reais, `alt` descritivo e `decoding="async"`.
**Observação:** as fotos têm menos resolução do que a lista pedia. O hero, com 928px de largura, fica
nítido até cerca de 460px de exibição em tela 2x. Vale gerar versões maiores antes de publicar.

## 6. SEO e acessibilidade

- `title` e `meta description` por página, Open Graph, `lang="pt-BR"`, `sitemap.xml`, `robots.txt`
  (bloqueia `/docs/`).
- JSON-LD `Physician` com nome, `medicalSpecialty` Otolaryngologic + Medicina Aeroespacial em texto,
  CRM e RQEs em `identifier`, os dois endereços como [PREENCHER] e `sameAs` com o Instagram.
- Favicon SVG com o monograma "RG" em Newsreader itálico, desenhado em path.
- Um H1 por página e hierarquia correta. `:focus-visible` global (2px champanhe-ink, offset 3px;
  linho sobre fundo escuro). Link "Pular para o conteúdo". Alvos de toque de pelo menos 44px.
  Ícones SVG inline com traço de 1,5px, `aria-hidden`.

## 7. Fases (as do nivel-agencia, adaptadas)

| Fase | Entrega | Verificação |
|---|---|---|
| 0 | `git init`, checkpoint com imagens e spec | `git log` |
| 1 | tokens.css, base.css, esqueleto do index.html | grep de fontes proibidas = 0 |
| 2 | home completa, sem efeitos | screenshots 360/768/1024/1440, sem rolagem horizontal |
| 3 | sobre, atendimentos, política | diff de header e rodapé entre as quatro páginas |
| 4 | main.js + effects.js | teclado do início ao fim, reduced-motion testado |
| 5 | humanizar-ui → humanizar → code-review → varredura | contraste de todo par, Lighthouse ≥ 95 nas quatro categorias, CLS 0, grep de termos CFM proibidos (melhor, única, garantid, sem dor, R$) = 0, lorem só em `<p>` de corpo |

Entrega final: resumo curto, lista de todos os [PREENCHER] e [CONFIRMAR] e como abrir o site.
