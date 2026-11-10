const avaliacoes = $('Ler avaliações').all();

return $input.all().map((item, i) => {
  const original = avaliacoes[i].json;

  let texto = item.json.content?.find(c => c.type === 'text')?.text ?? '';

  const inicio = texto.indexOf('{');
  const fim = texto.lastIndexOf('}');
  if (inicio >= 0 && fim > inicio) {
    texto = texto.slice(inicio, fim + 1);
  }

  let r;
  try {
    r = JSON.parse(texto);
  } catch (e) {
    r = {
      problemas: ['erro_leitura'],
      sentimento: '',
      urgencia: '',
      resumo: texto || ('Sem resposta: ' + item.json.stop_reason)
    };
  }

  return {
    json: {
      id: original.id,
      restaurante: original.restaurante,
      avaliacao: String(original.avaliacao).replace(/^"|"$/g, ''),
      problemas: (r.problemas || []).join(', '),
      sentimento: r.sentimento,
      urgencia: r.urgencia,
      resumo: r.resumo
    }
  };
});
