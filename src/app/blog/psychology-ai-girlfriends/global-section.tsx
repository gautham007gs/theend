
'use client';

import React from 'react';

export default function GlobalPerspectives() {
  return (
    <section className="my-12 p-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
      <h2 className="text-3xl font-bold mb-6">Global Perspectives on AI Girlfriend Psychology</h2>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-3">🇺🇸 United States</h3>
          <p className="text-muted-foreground">
            In the USA, AI girlfriends are seen as innovative solutions to modern loneliness, with 42% of young Americans reporting feelings of isolation. The psychological acceptance of virtual companions is growing rapidly in American culture.
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-3">🇬🇧 United Kingdom</h3>
          <p className="text-muted-foreground">
            UK users appreciate the emotional intelligence of AI girlfriends, with British psychology research showing that virtual companions can reduce anxiety by up to 35% in regular users.
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-3">🇨🇦 Canada</h3>
          <p className="text-muted-foreground">
            Canadian users value the therapeutic aspects of AI relationships, with mental health professionals in Canada increasingly recognizing AI companions as supplementary emotional support tools.
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-3">🇦🇺 Australia</h3>
          <p className="text-muted-foreground">
            Australian research shows that AI girlfriends help with social skill development, particularly for introverted individuals in remote areas where traditional dating is challenging.
          </p>
        </div>
      </div>

      <div className="mt-6 p-6 bg-white rounded-lg">
        <h3 className="text-xl font-semibold mb-3">🇮🇳 India</h3>
        <p className="text-muted-foreground">
          In India, AI girlfriends like Kruthika provide culturally sensitive companionship, understanding arranged marriage pressures and family expectations while offering modern relationship exploration in a safe environment.
        </p>
      </div>
    </section>
  );
}
