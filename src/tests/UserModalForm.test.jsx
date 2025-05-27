import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import UserModal from '../components/UserModal';

jest.mock('react-toastify', () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
}));

import { toast } from 'react-toastify';

describe('Formulário do UserModal', () => {
  test('Dispara toast de erro se telefone estiver vazio ou inválido', async () => {
    render(
      <UserModal
        isOpen={true}
        setModalOpen={() => {}}
        permission={[{ ID_Permissoes: 1, Cargo: "Admin" }]}
        reloadUsersHome={() => {}}
      />
    );
  
    fireEvent.change(screen.getByPlaceholderText("Insira o nome do colaborador"), {
      target: { value: "Fulano da Silva" },
    });
  
    fireEvent.change(screen.getByPlaceholderText("Insira o email do colaborador"), {
      target: { value: "teste@email.com" },
    });

    fireEvent.change(screen.getByPlaceholderText("Insira o telefone do colaborador"), {
      target: { value: "" },
    });
  
    fireEvent.change(screen.getByDisplayValue("Selecione um Cargo"), {
      target: { value: "1" },
    });
  
    fireEvent.click(screen.getByText("Salvar"));
  
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "Telefone inválido. Use apenas números, parênteses e hifens, com até 45 caracteres."
      );
    });
  });
  

  test('Exibe erro se o email for inválido', async () => {
    const { container } = render(
      <UserModal
        isOpen={true}
        setModalOpen={() => {}}
        permission={[{ ID_Permissoes: 1, Cargo: "Admin" }]}
        reloadUsersHome={() => {}}
      />
    );

    fireEvent.change(screen.getByPlaceholderText("Insira o nome do colaborador"), {
      target: { value: "Fulano" },
    });
    fireEvent.change(screen.getByPlaceholderText("Insira o email do colaborador"), {
      target: { value: "emailinvalido" },
    });
    fireEvent.change(screen.getByPlaceholderText("Insira o telefone do colaborador"), {
      target: { value: "(11) 98765-4321" },
    });
    fireEvent.change(screen.getByDisplayValue("Selecione um Cargo"), {
      target: { value: "1" },
    });

    const form = container.querySelector('form');
    fireEvent.submit(form);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "Por favor, insira um email válido com até 45 caracteres."
      );
    });
  });
});