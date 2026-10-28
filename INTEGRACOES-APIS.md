# OfertaReal — contrato de integração de preços (planejamento)

A integração com APIs de lojas e parceiros ainda NÃO está ativa.

## Objetivo

Receber observações de preços de fontes autorizadas e persistir histórico no Firestore, sem depender de valores históricos inventados.

## Campos mínimos da observação

- productId: identificador interno estável
- store: loja/vendedor
- price: preço em BRL (número positivo)
- source: identificador da API/feed autorizado
- observedAt: data/hora de observação na fonte
- productUrl: URL HTTPS da oferta
- availability: disponibilidade informada pela fonte
- sku / gtin / variant: identificadores para evitar comparar produtos diferentes

## Regras de implementação

1. Buscar preços somente em APIs ou feeds com autorização e termos compatíveis.
2. Validar moeda, disponibilidade, frete, vendedor, condição de pagamento e variante.
3. Executar ingestão exclusivamente em backend confiável (Cloud Functions/Cloud Run ou equivalente), nunca com chaves privadas no GitHub Pages.
4. Guardar segredos no gerenciador de segredos do provedor; nunca no repositório público.
5. Registrar histórico imutável e identificar a origem da informação.
6. Só exibir percentual de desconto histórico após reunir observações suficientes e comparáveis; definir janela e metodologia pública.
7. Implementar controle de taxa, logs, deduplicação, alertas e monitoramento.

## Situação atual

O painel admin permite cadastro manual e grava uma observação em price_history a cada salvamento. Isso não comprova preços anteriores e não é uma integração automática.
