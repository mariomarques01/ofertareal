# OfertaReal

Site: https://mariomarques01.github.io/ofertareal/
Admin: https://mariomarques01.github.io/ofertareal/admin.html

## O que funciona nesta versão

Catálogo público do Firestore, pesquisa, ordenação, link HTTPS da loja e consulta de histórico. A vitrine inicia vazia e nunca substitui falhas de conexão por produtos fictícios. O login anônimo é necessário apenas para salvar alertas; não existe envio automático de notificações.

A análise usa observações registradas, e não o campo de referência digitado. Exige preço confirmado em até 24 horas e 7 dias anteriores na janela de 30 dias para o mesmo SKU, loja e origem. Usa o menor preço por dia e a mediana desses valores. Destaca queda de pelo menos 5% apenas se o preço atual também não superar o menor da amostra. Dados manuais são identificados como não verificados independentemente. Se a consulta atingir 100 registros, a análise é suspensa até implementar paginação; não se presume que uma amostra incompleta represente todo o período.

## Administrador

Entre com Google no painel e copie seu UID. Um responsável com acesso ao projeto Firebase `blackfriday-c66bd` precisa substituir `SUBSTITUA_PELO_SEU_UID` em `firestore.rules` e publicar as regras. Não abra a escrita ao público. Autorize `mariomarques01.github.io` nos domínios do Firebase Authentication e habilite o provedor Google. A autenticação sozinha não concede permissão administrativa.

Cada salvamento confirma uma observação com data do servidor, mesmo quando o preço não mudou. Mantenha o mesmo SKU apenas para a mesma variante e condições. Informe loja, URL HTTPS e origem com as condições de pagamento e frete. Evite alterar essas condições no mesmo SKU.

## Limitação atual e integração automática

Não existe API de lojas, robô de coleta, comparação de frete por CEP, verificação de estoque nem envio de alertas. Para monitoramento automático será necessário escolher um fornecedor/feed autorizado e configurar um backend com credenciais e agendamento. Não é possível reconstruir preços históricos que nunca foram coletados. Veja `INTEGRACOES-APIS.md`.

## Desenvolvimento

`npm test` executa os testes de classificação. Sirva a raiz com `python3 -m http.server 8080` ou `npm run dev`.

O GitHub Pages publica a raiz da branch `main`. As regras do Firestore têm publicação separada pelo Firebase CLI, com uma conta autorizada; publicar HTML não atualiza as regras.
