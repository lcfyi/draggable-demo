import SortTree from "./SortableTree";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";
import { ExternalNodeContainer } from "./ExternalNode";
import { Divider, Container, Header } from "semantic-ui-react";

function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <Container>
        <Header as="h1" style={{ paddingTop: 10 }}>
          City Grouping Demo
        </Header>
        <Divider />
        <ExternalNodeContainer />
        <Divider />
        <SortTree />
      </Container>
    </DndProvider>
  );
}

export default App;
