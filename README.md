# OfertaReal

Projeto de comparação de ofertas e alertas de preços com Firebase.

## Próximos passos

1. Adicionar os arquivos da versão `oferta-real-admin-firebase.zip` na raiz deste repositório (extraindo a pasta `oferta-real`).
2. Ativar GitHub Codespaces e abrir um terminal.
3. Executar `npm install`, `npx firebase login --no-localhost` e `npx firebase deploy --only hosting --project blackfriday-c66bd`.
4. Entrar em `/admin.html` com Google, copiar o UID e configurar as regras administrativas do Firestore antes de tentar gravar produtos.

**Atenção:** os arquivos do aplicativo ainda precisam ser enviados. Não publique regras abertas a todos os usuários. Histórico real de preços e notificações automáticas ainda não estão implementados.
