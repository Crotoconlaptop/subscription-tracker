import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://kfxfzxfzjiaegisnxzna.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtmeGZ6eGZ6amlhZWdpc254em5hIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MzI5NTk5MiwiZXhwIjoyMDU4ODcxOTkyfQ.YYO7O4cIatyzHmXHVtEmm8VX08pE9yyICYY_DpPdnL4'
);

const email = 'gomezgiordanooscar@gmail.com';

async function main() {
  const { data, error: listError } = await supabase.auth.admin.listUsers();

  if (listError) {
    console.error('❌ Error listando usuarios:', listError);
    return;
  }

  const user = data.users.find((u) => u.email === email);

  if (!user) {
    console.log('⚠️ Usuario no encontrado.');
    return;
  }

  const { error: confirmError } = await supabase.auth.admin.updateUserById(user.id, {
    email_confirm: true,
  });

  if (confirmError) {
    console.error('❌ Error confirmando usuario:', confirmError);
  } else {
    console.log(`✅ Usuario confirmado manualmente: ${email}`);
  }
}

main();
