export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  const { P050, P051, P052, P053, callerid } = req.body;

  const phone_input = P050 || '';
  const bank_account = P051 || '';
  const amount = P052 || '';
  const reason = P053 || '';
  const phone = callerid || 'לא זוהה';

  const asana_token = '2/1206304491943748/1210400468232988:cf5e32dc1d9ef20920e6c79171ae762e';

  const data = {
    data: {
      name: `בקשה אוטומטית בטלפון ${phone_input}`,
      assignee: '1206304491943748',
      notes: `מספר חשבון הבנק: ${bank_account}\nסיבת הבקשה: ${reason}\n${phone}`,
      projects: ['1206308032337675', '1207075560098244'],
      custom_fields: {
        '1206304232493683': phone_input,
        '1207316302936690': '1207316302936697',
        '1207087719830219': '1207087719830220',
        '1207334946976592': amount,
        '1207087719831270': '1207087719831271',
      }
    }
  };

  try {
    const response = await fetch('https://app.asana.com/api/1.0/tasks', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${asana_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (response.status === 201) {
      res.status(200).send('המשימה נוצרה בהצלחה באסנה');
    } else {
      res.status(500).send('שגיאה: ' + JSON.stringify(result));
    }
  } catch (error) {
    res.status(500).send('שגיאה בבקשה ל־Asana: ' + error.message);
  }
}
