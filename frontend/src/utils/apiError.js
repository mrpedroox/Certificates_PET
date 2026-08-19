export function formatarErroApi(payload, mensagemPadrao) {
    const detalhe = payload?.detail;

    if (typeof detalhe === 'string') {
        return detalhe;
    }

    if (Array.isArray(detalhe)) {
        const mensagens = detalhe
            .map((erro) => erro?.msg)
            .filter(Boolean)
            .map((mensagem) => mensagem.replace(/^Value error,\s*/i, ''));

        if (mensagens.length > 0) {
            return mensagens.join('\n');
        }
    }

    return mensagemPadrao;
}
