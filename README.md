# SIMB — gerenciamento de material bélico da PPSC

Protótipo funcional em HTML, CSS e JavaScript. Acesso de demonstração: matrícula `100001`, senha `simb123`. Administrador: MARCELO SEIXAS. Cadastros de teste: policiais penais.

## Módulos
- Armas e equipamentos: cadastro, cautelas permanentes/temporárias e devoluções parciais/totais. Termo de cautela para impressão.
- Estoque de consumíveis: material, fabricante, modelo, categoria, calibre/apresentação, lote, validade, quantidade e valor unitário.
- ACAPS: entrega por atividade, curso, turma, disciplina e responsável; cautela vinculada para armas/equipamentos; conferência de consumo, devolução intacta, sprays parcialmente utilizados, falhas e outras destinações justificadas.
- Notas fiscais: leitura de XML de NF-e, revisão obrigatória e bloqueio de duplicidade pela chave. Equipamentos exigem patrimônio e série individual. Lotes XML são separados por `rastro`. Confira conversão da unidade comercial para quantidade física e custo unitário. PDF/imagem: consulta para digitação manual nesta fase.
- Relatórios: estoque, acervo, cautelas, ACAPS, notas e histórico; filtros, CSV, HTML independente e impressão/Salvar como PDF pelo navegador.
- Dados e backup: exportação/importação JSON com validação. Restaurar substitui os dados locais após confirmação.

## Limites desta fase
Dados permanecem no localStorage de cada navegador; não há servidor, banco compartilhado, autenticação institucional nem auditoria inviolável. Os saldos e preços iniciais são fictícios (valor zero significa não informado). Preserve os backups e documentos originais. O XML original importado é incluído no backup; PDFs/imagens consultados não são armazenados. Não há OCR automático nem validação de autorização/assinatura na SEFAZ. Não há sincronização entre dispositivos. TypeScript, Node.js e PostgreSQL são a arquitetura proposta para a próxima fase.

Sprays abertos são contabilizados separadamente por frasco; não é estimado volume consumido sem medição. Falhas ficam segregadas, sem voltar ao saldo disponível. Lotes vencidos são bloqueados para novas entregas. Equipamentos reutilizáveis são cautelados; recargas e cartuchos são consumíveis. A devolução de equipamentos vinculados ao ACAPS ocorre no módulo Devoluções.

Referências de catálogo: https://www.condornaoletal.com.br/products e páginas oficiais dos modelos cadastrados.

## Execução
Sirva a pasta por HTTP (por exemplo, `python -m http.server 8080`) e abra `http://localhost:8080`. O service worker mantém os arquivos da aplicação para uso offline.
