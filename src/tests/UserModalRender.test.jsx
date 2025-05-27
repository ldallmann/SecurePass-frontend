import React from "react";
import { render, screen } from "@testing-library/react";
import UserModal from "../components/UserModal.js";

describe("Renderização do UserModal", () => {
  test("Renderiza modal quando isOpen é true", () => {
    render(<UserModal isOpen={true} setModalOpen={() => {}} permission={[]} reloadUsersHome={() => {}} />);
    expect(screen.getByText("Nome:")).toBeInTheDocument();
  });

  test("Permite selecionar um cargo", () => {
    const mockPerms = [{ ID_Permissoes: 1, Cargo: "Admin" }];
    render(<UserModal isOpen={true} setModalOpen={() => {}} permission={mockPerms} reloadUsersHome={() => {}} />);
    expect(screen.getByDisplayValue("Selecione um Cargo")).toBeInTheDocument();
  });

  test("Clica no botão de cancelar e fecha modal", () => {
    const setModalOpen = jest.fn();
    render(<UserModal isOpen={true} setModalOpen={setModalOpen} permission={[]} reloadUsersHome={() => {}} />);
    screen.getByText(/Cancelar/i).click();
    expect(setModalOpen).toHaveBeenCalledWith(false);
  });
});