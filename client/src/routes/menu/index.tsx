import { createFileRoute } from '@tanstack/react-router';
import MenuList from '../../components/menu/MenuList';

export const Route = createFileRoute('/menu/')({
  component: Menu,
});

function Menu() {
  return (
    <div style={{ flex: 1, padding: '2rem' }}>
      <MenuList />
    </div>
  );
} 