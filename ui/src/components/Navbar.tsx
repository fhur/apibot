import {
  Alignment,
  Button,
  ButtonGroup,
  Menu,
  MenuDivider,
  MenuItem,
  Navbar,
} from "@blueprintjs/core";
import { Popover2 } from "@blueprintjs/popover2";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  $environments,
  $executionRequestId,
  $selectedEnvironmentId,
  $selectedGraph,
  $showAlert,
  $showDrawer,
} from "../state";

export function EnvMenu(props: {}) {
  const envs = useRecoilValue($environments);
  const [selectedEnv, setSelectedEnvironmentId] = useRecoilState(
    $selectedEnvironmentId
  );
  return (
    <Menu>
      <MenuItem text="Pick an environment" disabled></MenuItem>
      <MenuDivider />
      {envs.map((env) => (
        <MenuItem
          key={env}
          style={{ fontWeight: selectedEnv === env ? "bold" : undefined }}
          text={env}
          onClick={() => setSelectedEnvironmentId(env)}
        />
      ))}
    </Menu>
  );
}

export function NavigationBar() {
  const [selectedEnvironmentId] = useRecoilState($selectedEnvironmentId);

  const setShowAlert = useSetRecoilState($showAlert);
  const selectedGraph = useRecoilValue($selectedGraph);
  const executionRequestId = useRecoilValue($executionRequestId);

  const isExecuting = executionRequestId !== undefined;

  const [, setShowDrawer] = useRecoilState($showDrawer);

  return (
    <Navbar>
      <Navbar.Group align={Alignment.LEFT}>
        <Navbar.Heading>
          <strong>Apibot</strong>
        </Navbar.Heading>
        <Navbar.Divider />
        <Navbar.Heading>{selectedGraph?.root?.title}</Navbar.Heading>
      </Navbar.Group>
      <Navbar.Group align={Alignment.RIGHT}>
        <Button
          minimal
          icon="list"
          onClick={() => setShowDrawer((show) => !show)}
        >
          Execution Results
        </Button>

        {/* <Button minimal icon="export">
          Share
        </Button> */}

        <Navbar.Divider />

        <ButtonGroup>
          <Button
            intent="primary"
            icon="play"
            loading={isExecuting}
            text={`${selectedEnvironmentId}`}
            disabled={selectedGraph === undefined}
            onClick={() => setShowAlert("confirm-execute-graph")}
          ></Button>

          {!isExecuting && (
            <Popover2
              placement="bottom"
              minimal={false}
              hasBackdrop={true}
              autoFocus={false}
              content={<EnvMenu />}
            >
              <Button intent="primary" icon="caret-down"></Button>
            </Popover2>
          )}
        </ButtonGroup>
      </Navbar.Group>
    </Navbar>
  );
}
