import * as React from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import {
  $currentConfigPath,
  $currentExecution,
  $executionRequestId,
  $scopes,
  $selectedEnvironmentId,
  $selectedGraphId,
  $showAlert,
  $showDrawer,
} from "../state";
import { ipc } from "./ipc";

export function useExecuteGraph() {
  const selectedGraphId = useRecoilValue($selectedGraphId);
  const currentConfigPath = useRecoilValue($currentConfigPath);
  const selectedEnvironmentId = useRecoilValue($selectedEnvironmentId);

  const setShowAlert = useSetRecoilState($showAlert);
  const setExecutionRequestId = useSetRecoilState($executionRequestId);
  const setCurrentExecution = useSetRecoilState($currentExecution);
  const setShowDrawer = useSetRecoilState($showDrawer);
  const setScope = useSetRecoilState($scopes);

  return React.useCallback(() => {
    if (!selectedGraphId) {
      return;
    }
    setShowAlert(undefined);
    const requestId = "execution-request-id: " + Math.floor(Date.now() / 10000);
    setExecutionRequestId(requestId);

    const removeListener = ipc.onLogEntry(({ nodeId, scope }) => {
      console.log("onLogEntry", nodeId);
      setScope((scopes) => {
        return {
          ...scopes,
          [nodeId]: scope,
        };
      });
    });
    ipc
      .executeGraph({
        graphId: selectedGraphId,
        configFilePath: currentConfigPath,
        envId: selectedEnvironmentId!,
      })
      .then((scope) => setCurrentExecution(scope))
      .finally(() => {
        setExecutionRequestId(undefined);
        setShowDrawer(true);
        removeListener();
      });
  }, [
    currentConfigPath,
    selectedEnvironmentId,
    selectedGraphId,
    setCurrentExecution,
    setExecutionRequestId,
    setScope,
    setShowAlert,
    setShowDrawer,
  ]);
}
