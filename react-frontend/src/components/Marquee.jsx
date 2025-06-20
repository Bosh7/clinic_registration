import './Marquee.css';

export default function Marquee({ text }) {
  return (
    <div className="marquee-container">
      <div className="marquee-text">{text}</div>
    </div>
  );
}
