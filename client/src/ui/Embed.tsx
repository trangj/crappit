/* eslint-disable jsx-a11y/anchor-has-content */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';

type EmbedProps = {
  url: string
}

function Embed({ url }: EmbedProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (window.iframely) {
      window.iframely.load();
    }
  }, [url, mounted]);

  return mounted ? (
    <div className="iframely-embed">
      <div className="iframely-responsive">
        <a data-iframely-url href={url} />
      </div>
    </div>
  ) : null;
}

export default Embed;
