// Template do e-mail de verificação, exportado originalmente do
// dashboard do Resend (aba Templates) e adaptado com um fundo
// estilizado na paleta do GTB (gradiente sunset roxo/laranja,
// clima parecido com as artes de referência do site, sem copiar
// nada específico de outro jogo).
//
// Fica como uma constante TypeScript (não um arquivo .html
// separado lido em runtime) de propósito: arquivos que não são
// código podem não ser incluídos automaticamente no bundle de uma
// Vercel Function, e `readFileSync` apontando pra um caminho que
// não existe no ambiente de produção quebraria o envio de e-mail
// silenciosamente. Como string aqui, sempre vai junto.
//
// Se um dia você editar o template de novo pelo dashboard do
// Resend, é só exportar o novo HTML e colar dentro da template
// string abaixo (mantendo as variáveis {{email_title}},
// {{first_name}}, {{email_intro}}, {{verification_code}}).
export const EMAIL_TEMPLATE = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html dir="ltr" lang="en"><head><meta content="width=device-width" name="viewport"/><meta content="text/html; charset=UTF-8" http-equiv="Content-Type"/><meta name="x-apple-disable-message-reformatting"/><meta content="IE=edge" http-equiv="X-UA-Compatible"/><meta name="x-apple-disable-message-reformatting"/><meta content="telephone=no,address=no,email=no,date=no,url=no" name="format-detection"/><title>Use este código para verificar sua conta em gtb-the-site.vercel.app.</title><!--[if mso]>
<style type="text/css">
  table, td { border-collapse: collapse; }
</style>
<![endif]--></head><body dir="ltr" lang="en" style="background-color:#0d0d10;margin:0;padding:0"><!--$--><!--html--><!--head--><div style="display:none;overflow:hidden;line-height:1px;opacity:0;max-height:0;max-width:0" data-skip-in-text="true">Use este código para verificar sua conta em gtb-the-site.vercel.app.</div><!--body--><table border="0" width="100%" cellPadding="0" cellSpacing="0" role="presentation" align="center" style="background-color:#0d0d10"><tbody><tr><td dir="ltr" lang="en" align="center" style="font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;font-size:1em;min-height:100%;line-height:155%;background-color:#0d0d10;letter-spacing:4px;color:#e9e6df;padding:32px 16px">

<!--[if mso]>
<v:rect xmlns:v="urn:schemas-microsoft-com:vml" fill="true" stroke="false" style="width:600px;">
<v:fill type="gradient" color="#2b1240" color2="#7a2d4d" angle="135" />
<v:textbox inset="0,0,0,0">
<![endif]-->

<table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="max-width:600px;width:100%;border-radius:12px;background-color:#3a1550;background-image:linear-gradient(135deg, #2b1240 0%, #5c1f57 45%, #c0563f 100%);"><tbody><tr style="width:100%"><td style="padding-top:36px;padding-right:40px;padding-bottom:40px;padding-left:40px">

<table width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="margin-bottom:28px"><tbody><tr><td align="left"><span style="display:inline-block;width:10px;height:10px;border-radius:50%;background-color:#52db0f;margin-right:6px;vertical-align:middle"></span><span style="display:inline-block;width:10px;height:10px;border-radius:50%;background-color:#8f13eb;margin-right:6px;vertical-align:middle"></span><span style="font-size:0.7em;letter-spacing:3px;text-transform:uppercase;color:rgba(233,230,223,0.55);vertical-align:middle">gtb-the-site.vercel.app</span></td></tr></tbody></table>

<table width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="background-color:#15121a;border-radius:10px;border:1px solid rgba(255,255,255,0.08)"><tbody><tr><td style="padding:32px 28px">

<h1 style="margin:0;padding:0;font-size:1.7em;line-height:1.3em;font-weight:700;text-align:left;color:#f4f0fa;letter-spacing:0.5px">{{email_title}}</h1>
<p style="margin:0;padding:0;font-size:1em;padding-top:0.9em;padding-bottom:0.3em;color:#d8d4e0;letter-spacing:0.2px">Olá {{first_name}},</p>
<p style="margin:0;padding:0;font-size:0.95em;padding-top:0.3em;padding-bottom:0.3em;color:#b8b2c4;letter-spacing:0.2px;line-height:1.6">{{email_intro}}</p>

<table width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="background-color:#0d0d10;border-radius:8px;margin-top:22px;margin-bottom:22px;border:1px solid rgba(82,219,15,0.25)"><tbody><tr><td style="padding:22px 16px;text-align:center">
<span style="font-size:1.9em;font-weight:700;letter-spacing:8px;font-family:monospace;color:#52db0f">{{verification_code}}</span>
</td></tr></tbody></table>

<p style="margin:0;padding:0;font-size:0.85em;padding-top:0.3em;padding-bottom:0.3em;color:#a39dae;letter-spacing:0.2px">Este código expira em <strong style="color:#d8d4e0">15 minutos</strong>. Por segurança, não compartilhe com ninguém.</p>

<table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="margin-top:20px"><tbody style="width:100%"><tr style="width:100%"><td align="left"><a class="button" href="https://gtb-the-site.vercel.app" style="line-height:100%;text-decoration:none;display:inline-block;max-width:100%;mso-padding-alt:0px;margin:0;padding:12px 26px;background-color:#8f13eb;color:#ffffff;border-radius:6px;font-weight:600;font-size:0.85em;text-align:center;letter-spacing:0.5px" target="_blank">Acessar minha conta</a></td></tr></tbody></table>

<p style="margin:0;padding:0;font-size:0.8em;padding-top:1.4em;color:#8a8395;letter-spacing:0.2px;line-height:1.6">Se você não solicitou este código, ignore este email com segurança.</p>

</td></tr></tbody></table>

<table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="margin-top:24px"><tbody><tr><td style="text-align:center"><p style="margin:0;padding:0;font-size:11px;color:rgba(233,230,223,0.4);letter-spacing:0.5px">gtb-the-site &middot; © 2026 &middot; Todos os direitos reservados.</p></td></tr></tbody></table>

</td></tr></tbody></table>

<!--[if mso]>
</v:textbox>
</v:rect>
<![endif]-->

</td></tr></tbody></table><!--/$--></body></html>`
