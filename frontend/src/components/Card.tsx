interface CardProps {
  title: string;
  value: number;
  color: string;
}

export default function Card({ title, value, color }: CardProps) {
  return (
    <div className={`p-6 rounded-xl shadow-md text-white text-center`} style={{ backgroundColor: color }}>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-2xl font-bold mt-2">{value}</p>
    </div>
  );
}