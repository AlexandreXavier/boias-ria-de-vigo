# boias-ria-de-vigo

## Resumo

Aplicação React/Vite para gestão das boias da Ría de Vigo. O app oferece:

- Mapa interativo (Leaflet) centrado na Ría para visualizar marcadores.
- Painel lateral com selector de percursos, formulário para adicionar boias e lista filtrada por rota.
- Conversão automática entre coordenadas em graus/minutos e decimais para normalizar novos registos.
- Integração visual consistente (Tailwind/Lucide) optimizada para desktop e tablets.

## TODO

1. Persistir boias em storage (API ou local) para manter dados entre sessões.
2. Permitir edição de marcadores existentes (nome, descrição, coordenadas).
3. Destacar rotas activas no mapa com linhas/cores distintas.
4. Adicionar validações avançadas no formulário (intervalos e mensagens de erro mais claras).
5. Internacionalizar UI/PT-ES e preparar traduções para EN.
6. Incluir painel com dados meteorológicos em tempo real por boia (quando disponível).