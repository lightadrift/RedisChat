# RedisChat
Um exemplo básico de um chat em react. A comunicação em tempo real é feita com websockets, enquanto o storage das mensagens é no redis db. O serviodor em si é bem simples. O usuário cria uma conta e se conecta ao chat. Não há nenhum tipo de criptografia ponta a ponta porque ficaria grande demais um projeto exemplo que é pra ser rápido. A utlização de um servidor separado do client (não usando um framework fullstack) é meramente pelo motivo da curiosidade de mexer com SWC pra compilação e bundling do server.

