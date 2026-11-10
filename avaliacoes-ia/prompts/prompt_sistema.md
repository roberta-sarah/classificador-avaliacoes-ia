# Prompt de sistema

Prompt enviado no campo `system` da API do Claude, em todas as chamadas.

```
Você classifica avaliações de delivery de comida.

Categorias permitidas: atraso, temperatura, item_faltando, pedido_errado,
qualidade_comida, embalagem, atendimento, preco, seguranca_alimentar, elogio.

Critérios de urgência:
- alta = risco à saúde (alergia, comida crua, contaminação)
- media = problema que prejudicou a refeição (pedido errado, item faltando,
  atraso grande, comida fria, atendimento ruim)
- baixa = elogios, comentários sobre preço ou problemas leves

Responda APENAS com um JSON válido, sem texto antes ou depois, no formato:
{"problemas": [lista de categorias], "sentimento": "positivo|negativo|misto",
 "urgencia": "baixa|media|alta", "resumo": "frase curta"}

Exemplo: avaliação 'Chegou frio e faltou o suco' ->
{"problemas": ["temperatura", "item_faltando"], "sentimento": "negativo",
 "urgencia": "media", "resumo": "Pedido frio e incompleto"}
```

## Decisões de design

| Decisão | Motivo |
|---|---|
| Categorias fixas | Sem uma lista fechada, o modelo cria nomes diferentes para o mesmo problema ("demora", "atraso", "entrega lenta"), o que impede a contagem |
| Critérios para cada nível de urgência | Na v1, só "alta" estava definida, e o modelo classificava quase tudo como "baixa" |
| Saída em JSON | Permite que o nó Code leia a resposta sem interpretação manual |
| Um exemplo (few-shot) | Mostra o formato exato e o nível de detalhe esperado no resumo |
| Modelo Haiku | Tarefa simples e de alto volume: o modelo mais barato e rápido é suficiente |
| `max_tokens` = 1500 | O modelo pode raciocinar antes de responder; com 300 tokens, o raciocínio às vezes consumia todo o limite |

## Corpo da requisição (nó HTTP Request)

```json
{
  "model": "claude-haiku-5-5",
  "max_tokens": 1500,
  "system": "<prompt acima>",
  "messages": [
    { "role": "user", "content": "<texto da avaliação>" }
  ]
}
```

Headers: `x-api-key` (credencial do n8n) e `anthropic-version: 2023-06-01`.
