import { useState } from 'react';
import { sharepackAPI } from '../utils/api';

function SharePage() {
  const [email, setEmail] = useState('');
  const [generating, setGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!email.trim()) {
      alert('Please enter an email address');
      return;
    }

    setGenerating(true);
    try {
      const blob = await sharepackAPI.generate({
        peopleSlugs: [], // Add logic to select people
        projectSlugs: [], // Add logic to select projects
        requesterEmail: email
      });

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'lookbook-sharepack.pdf';
      link.click();
      window.URL.revokeObjectURL(url);

      alert('PDF generated successfully!');
    } catch (err) {
      console.error('Failed to generate PDF:', err);
      alert('Failed to generate PDF');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div>
      <h1>Generate Sharepack</h1>
      <p className="text-muted mt-sm">
        Create a PDF with selected profiles and projects
      </p>

      <div className="mt-xl" style={{ maxWidth: '500px' }}>
        <label className="mb-sm" style={{ display: 'block', fontWeight: '500' }}>
          Your Email
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          className="search-input mb-lg"
          style={{ width: '100%' }}
        />

        <div className="empty-state mt-lg mb-lg">
          <p className="text-muted">
            Note: In the full version, you would be able to select specific people and projects to include in the PDF.
          </p>
        </div>

        <button
          onClick={handleGenerate}
          disabled={generating}
          className="btn btn--primary"
        >
          {generating ? 'Generating...' : 'Generate PDF'}
        </button>
      </div>
    </div>
  );
}

export default SharePage;


