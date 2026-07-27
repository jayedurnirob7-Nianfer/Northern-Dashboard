const fs = require('fs');

let code = fs.readFileSync('src/app/Dashboard.tsx', 'utf8');

const resizableHeaderComponent = `
const ResizableHeader = ({ children, minWidth = 50, defaultWidth = 100 }: any) => {
  const [width, setWidth] = React.useState(defaultWidth);
  const startResizing = React.useCallback((mouseDownEvent: React.MouseEvent) => {
    mouseDownEvent.preventDefault();
    const startX = mouseDownEvent.clientX;
    const startWidth = width;
    
    const onMouseMove = (mouseMoveEvent: MouseEvent) => {
      const newWidth = Math.max(minWidth, startWidth + mouseMoveEvent.clientX - startX);
      setWidth(newWidth);
    };
    
    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
    
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }, [width, minWidth]);

  return (
    <th className="p-0 border-b border-gray-200 dark:border-[#27272a] relative select-none group" style={{ width, minWidth: width, maxWidth: width }}>
      <div className="p-3 text-gray-700 dark:text-gray-400 font-semibold whitespace-nowrap overflow-hidden text-ellipsis">
        {children}
      </div>
      <div 
        onMouseDown={startResizing}
        className="absolute right-0 top-0 bottom-0 w-2 cursor-col-resize hover:bg-[#8b5cf6] dark:hover:bg-[#8b5cf6] opacity-0 group-hover:opacity-100 z-10 transition-colors"
      />
    </th>
  );
};

export default function Dashboard() {
`;

code = code.replace('export default function Dashboard() {', resizableHeaderComponent);

fs.writeFileSync('src/app/Dashboard.tsx', code);
console.log('Fixed missing component');
