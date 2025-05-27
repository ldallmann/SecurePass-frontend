import React, { useMemo } from "react";
import styles from '../styles/Home.module.css';
import { Link } from "react-router-dom";
import UserModal from "../components/UserModal";
import { useState } from "react";
import Header from '../components/Header';
import { RiPlayListAddLine } from "react-icons/ri";
import { GoGear, GoPeople, GoCheckCircle, GoXCircle } from "react-icons/go";
import { AiOutlineCalendar } from "react-icons/ai";

function Home({ usersHome, permission, accessTest, reloadUsersHome }) {
    const [openModal, setOpenModal] = useState(false);

    const formatStatus = (status) => {
        return status === 'A' ? 'Sim' : 'Não';
    };

    const totalUsuarios = usersHome.length;
    const usuariosAtivos = usersHome.filter(u => u.Status === 'A').length;
    const usuariosInativos = totalUsuarios - usuariosAtivos;

    const isToday = (dateString) => {
        const today = new Date();
        const accessDate = new Date(dateString);
        return (
            accessDate.getFullYear() === today.getFullYear() &&
            accessDate.getMonth() === today.getMonth() &&
            accessDate.getDate() === today.getDate()
        );
    };

    const acessosHoje = accessTest.filter(access => isToday(access.Data_Hora_acesso)).length;

    return (
        <div className={styles.main}>
            <Header />
            <div className={styles.homeSeparateDiv}>
                <section className={styles.dashboardContainer}>
                    <div className={styles.dashboardCards}>
                        <div className={styles.card}>
                            <div className={styles.cardData}>
                                <GoPeople size={32} color="#0066cc" />
                                <span>Total de Usuários:</span>
                            </div>
                            <strong>{totalUsuarios}</strong>
                        </div>
                        <div className={styles.card}>
                            <div className={styles.cardData}>
                                <GoCheckCircle size={32} color="green" />
                                <span>Ativos:</span>
                            </div>
                            <strong>{usuariosAtivos}</strong>
                        </div>
                        <div className={styles.card}>
                            <div className={styles.cardData}>
                                <GoXCircle size={32} color="red" />
                                <span>Inativos:</span>
                            </div>
                            <strong>{usuariosInativos}</strong>
                        </div>
                        <div className={styles.card}>
                            <div className={styles.cardData}>
                                <AiOutlineCalendar size={32} color="#f0a500" />
                                <span>Acessos Hoje:</span>
                            </div>
                            <strong>{acessosHoje}</strong>
                        </div>
                    </div>
                </section>

                <main className={styles.mainContainer}>
                    <section className={styles.mainSectionContainer}>
                        <article className={styles.articleTable}>
                            <div className={`${styles.tableRow} ${styles.firsRow}`}>
                                <div className={styles.idNameContainer}>
                                    <span className={`${styles.idCell} ${styles.firstRow}`}>ID</span>
                                    <span className={`${styles.nameCell} ${styles.firstRow}`}>NOME</span>
                                </div>

                                <div className={styles.cargoSettingsContainer}>
                                    <span className={`${styles.cargo} ${styles.firstRow}`}>CARGO</span>
                                    <span className={`${styles.ativo} ${styles.firstRow}`}>ATIVO</span>
                                    <button onClick={() => setOpenModal(true)}><RiPlayListAddLine /></button>
                                    
                                </div>
                                <UserModal
                                    isOpen={openModal}
                                    setModalOpen={() => setOpenModal(!openModal)}
                                    permission={permission.length ? permission : []}
                                    reloadUsersHome={reloadUsersHome}
                                />
                            </div>

                            <div className={styles.overflowTable}>
                                {usersHome.map((user) => (
                                    <React.Fragment key={user.ID_Usuario}>
                                        <div className={`${styles.tableRow} ${styles.tableRowHover}`}>
                                            <div className={styles.idNameContainer}>
                                                <span className={styles.idCell}>{user.ID_Usuario}</span>
                                                <span className={styles.nameCell}>{user.Nome_Usuario}</span>
                                            </div>

                                            <div className={styles.cargoSettingsContainer}>
                                                <span className={styles.roleCell}>{user.Cargo}</span>
                                                <span className={styles.activeCell}>{formatStatus(user.Status)}</span>
                                                <Link to={`/profile/${user.ID_Usuario}`} className={styles.optionsCell} >
                                                <GoGear />
                                                </Link>
                                            </div>
                                        </div>

                                        <div className={styles.line}></div>
                                    </React.Fragment>
                                ))}
                            </div>
                        </article>
                    </section>
                </main>
            </div>
        </div>
    );
}

export default Home;