# Boias-Ria-de-Vigo

## Resumo

Aplicação React/Vite para gestão das boias da Ría de Vigo. O app oferece:

- Mapa interativo (Leaflet) centrado na Ría para visualizar marcadores.
- Painel lateral com selector de percursos, formulário para adicionar boias e lista filtrada por rota.
- Conversão automática entre coordenadas em graus/minutos e decimais para normalizar novos registos.
- Integração visual consistente (Tailwind/Lucide) optimizada para desktop e tablets.

## Tecnologias

- **React 19 + TypeScript 5** para uma base moderna de componentes tipados.
- **Vite 6** como bundler rápido com hot-module replacement durante o desenvolvimento.
- **Leaflet 1.9 + React-Leaflet 5** para renderizar o mapa interativo e os marcadores das boias.
- **Lucide Icons** para ícones leves e personalizáveis na UI.
- **React Markdown** para renderizar conteúdos textuais ricos (ex.: instruções de boias) quando necessário.
- **Google GenAI SDK** preparado para futuras experiências assistidas/explicativas dentro da aplicação.
- **CSS utilitário (Tailwind-like)** aplicado diretamente através das classes para garantir consistência visual sem folhas de estilo extensas.

## TODO

- [ ] Persistir boias em storage (API ou local) para manter dados entre sessões.
- [ ] Permitir edição de marcadores existentes (nome, descrição, coordenadas).
- [ ] Destacar rotas activas no mapa com linhas/cores distintas.
- [ ] Adicionar validações avançadas no formulário (intervalos e mensagens de erro mais claras).
- [ ] Internacionalizar UI/PT-ES e preparar traduções para EN.
- [ ] Incluir painel com dados meteorológicos em tempo real por boia (quando disponível).