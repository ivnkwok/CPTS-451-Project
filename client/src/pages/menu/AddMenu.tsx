import AddMenuItemForm from "../../components/menu/AddMenuItem.tsx";

/**
 * Page for adding a new menu item.
 * Renders a header and the `AddMenuItemForm` component.
 *
 * @component
 * @returns {JSX.Element} A page with a form for adding new menu items.
*/
export default function AddMenuPage() {
  return (
    <div style={{width: '100%'}}>
      <AddMenuItemForm />
    </div>
  );
}