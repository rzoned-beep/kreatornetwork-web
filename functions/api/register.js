export async function onRequestPost({ request, env }) {
  try {
    const data = await request.json();

    console.log('[KreatorNetwork] New Registration:', JSON.stringify(data));

    // Optional: If Resend API Key is configured in Cloudflare Pages Environment
    if (env && env.RESEND_API_KEY && env.ADMIN_EMAIL) {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'KreatorNetwork <notifications@kreatornetwork.com>',
          to: [env.ADMIN_EMAIL],
          subject: `Kreator Baru Mendaftar: ${data.fullName || 'Member'} (${data.platform || '-'})`,
          text: `Ada pendaftaran kreator baru di KreatorNetwork.com:\n\nNama: ${data.fullName}\nEmail: ${data.email}\nWhatsApp: ${data.whatsapp}\nPlatform: ${data.platform}\nHandle: ${data.handle}\nNiche: ${data.niche}\nWaktu: ${data.timestamp}\n`,
        }),
      }).catch(err => console.error('Error forwarding to Resend:', err));
    }

    // Optional: If Webhook URL is configured
    if (env && env.WEBHOOK_URL) {
      await fetch(env.WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }).catch(err => console.error('Error forwarding to Webhook:', err));
    }

    return new Response(JSON.stringify({
      success: true,
      message: 'Pendaftaran berhasil diterima dan sedang diproses.',
      data: {
        fullName: data.fullName,
        email: data.email,
        platform: data.platform
      }
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });

  } catch (err) {
    return new Response(JSON.stringify({
      success: false,
      error: err.message || 'Internal error'
    }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
