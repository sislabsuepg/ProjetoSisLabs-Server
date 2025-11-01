CREATE DATABASE sislabs WITH ENCODING 'UTF8';
\connect sislabs
SET search_path TO public;
BEGIN;
CREATE TABLE IF NOT EXISTS curso ( id SERIAL PRIMARY KEY, nome VARCHAR(40) NOT NULL UNIQUE, "anosMaximo" INTEGER NOT NULL CHECK ("anosMaximo" BETWEEN 1 AND 8), ativo BOOLEAN NOT NULL DEFAULT TRUE );
CREATE TABLE IF NOT EXISTS "permissaoUsuario" ( id SERIAL PRIMARY KEY, "nomePermissao" VARCHAR(30) NOT NULL UNIQUE, geral BOOLEAN NOT NULL DEFAULT FALSE, cadastro BOOLEAN NOT NULL DEFAULT FALSE, alteracao BOOLEAN NOT NULL DEFAULT FALSE, relatorio BOOLEAN NOT NULL DEFAULT FALSE, advertencia BOOLEAN NOT NULL DEFAULT FALSE, ativo BOOLEAN NOT NULL DEFAULT TRUE );
CREATE TABLE IF NOT EXISTS professor ( id SERIAL PRIMARY KEY, nome VARCHAR(40) NOT NULL UNIQUE, email VARCHAR(40) NOT NULL UNIQUE, ativo BOOLEAN NOT NULL DEFAULT TRUE );
CREATE TABLE IF NOT EXISTS laboratorio ( id SERIAL PRIMARY KEY, numero VARCHAR(8) NOT NULL UNIQUE, nome VARCHAR(60) NOT NULL UNIQUE, restrito BOOLEAN NOT NULL DEFAULT FALSE, ativo BOOLEAN NOT NULL DEFAULT TRUE );
CREATE TABLE IF NOT EXISTS aluno ( id SERIAL PRIMARY KEY, ra VARCHAR(13) NOT NULL UNIQUE, nome VARCHAR(40) NOT NULL, telefone VARCHAR(15), "anoCurso" INTEGER NOT NULL CHECK ("anoCurso" BETWEEN 1 AND 8), email VARCHAR(40), senha VARCHAR(32) NOT NULL DEFAULT '', ativo BOOLEAN NOT NULL DEFAULT TRUE, "idCurso" INTEGER REFERENCES curso(id) ON UPDATE CASCADE ON DELETE SET NULL, CONSTRAINT aluno_chk_ra_len CHECK (char_length(ra) BETWEEN 5 AND 13), CONSTRAINT aluno_chk_ra_numerico CHECK (ra ~ '^[0-9]+$'), CONSTRAINT aluno_chk_nome CHECK (char_length(nome) BETWEEN 3 AND 40), CONSTRAINT aluno_chk_email_len CHECK (email IS NULL OR char_length(email) <= 40), CONSTRAINT aluno_chk_telefone CHECK (telefone IS NULL OR telefone ~ '^[0-9() +\-]{10,20}$') );
CREATE TABLE IF NOT EXISTS usuario ( id SERIAL PRIMARY KEY, login VARCHAR(20) NOT NULL UNIQUE, senha VARCHAR(32) NOT NULL, nome VARCHAR(40) NOT NULL, ativo BOOLEAN NOT NULL DEFAULT TRUE, "idPermissao" INTEGER NOT NULL REFERENCES "permissaoUsuario"(id) ON UPDATE CASCADE ON DELETE CASCADE, CONSTRAINT usuario_chk_nome CHECK (char_length(nome) BETWEEN 3 AND 40) );
CREATE TABLE IF NOT EXISTS evento ( id SERIAL PRIMARY KEY, nome VARCHAR(40) NOT NULL, data TIMESTAMPTZ NOT NULL, duracao INTEGER NOT NULL CHECK (duracao > 0 AND duracao <= 1440), responsavel VARCHAR(40), "idLaboratorio" INTEGER REFERENCES laboratorio(id) ON UPDATE CASCADE ON DELETE SET NULL );
CREATE TABLE IF NOT EXISTS horario ( id SERIAL PRIMARY KEY, "diaSemana" INTEGER NOT NULL CHECK ("diaSemana" BETWEEN 0 AND 6), horario VARCHAR(5) NOT NULL CHECK (horario ~ '^[0-2][0-9]:[0-5][0-9]'), "idLaboratorio" INTEGER REFERENCES laboratorio(id) ON UPDATE CASCADE ON DELETE SET NULL, "idProfessor" INTEGER REFERENCES professor(id) ON UPDATE CASCADE ON DELETE SET NULL );
CREATE TABLE IF NOT EXISTS orientacao ( id SERIAL PRIMARY KEY, "dataInicio" TIMESTAMPTZ NOT NULL, "dataFim" TIMESTAMPTZ NOT NULL, "idAluno" INTEGER REFERENCES aluno(id) ON UPDATE CASCADE ON DELETE SET NULL, "idLaboratorio" INTEGER REFERENCES laboratorio(id) ON UPDATE CASCADE ON DELETE SET NULL, "idProfessor" INTEGER REFERENCES professor(id) ON UPDATE CASCADE ON DELETE SET NULL, CONSTRAINT orientacao_chk_periodo CHECK ("dataFim" > "dataInicio") );
CREATE TABLE IF NOT EXISTS emprestimo ( id SERIAL PRIMARY KEY, "dataHoraEntrada" TIMESTAMPTZ NOT NULL, "dataHoraSaida" TIMESTAMPTZ, "posseChave" BOOLEAN NOT NULL DEFAULT FALSE, advertencia BOOLEAN DEFAULT FALSE, "idAluno" INTEGER REFERENCES aluno(id) ON UPDATE CASCADE ON DELETE SET NULL, "idUsuarioEntrada" INTEGER REFERENCES usuario(id) ON UPDATE CASCADE ON DELETE SET NULL, "idUsuarioSaida" INTEGER REFERENCES usuario(id) ON UPDATE CASCADE ON DELETE SET NULL, "idLaboratorio" INTEGER REFERENCES laboratorio(id) ON UPDATE CASCADE ON DELETE SET NULL, CONSTRAINT emprestimo_chk_datas CHECK ("dataHoraSaida" IS NULL OR "dataHoraSaida" > "dataHoraEntrada") );
CREATE TABLE IF NOT EXISTS recado ( id SERIAL PRIMARY KEY, texto TEXT NOT NULL CHECK (char_length(texto) BETWEEN 1 AND 1000) );
CREATE TABLE IF NOT EXISTS registro ( id SERIAL PRIMARY KEY, "dataHora" TIMESTAMPTZ NOT NULL, descricao VARCHAR(100) NOT NULL, "idUsuario" INTEGER REFERENCES usuario(id) ON UPDATE CASCADE ON DELETE SET NULL );
CREATE TABLE IF NOT EXISTS reseter ( id INTEGER PRIMARY KEY, "lastReset" TIMESTAMPTZ );
CREATE INDEX IF NOT EXISTS idx_aluno_ra ON aluno(ra);
CREATE INDEX IF NOT EXISTS idx_aluno_idCurso ON aluno("idCurso");
CREATE INDEX IF NOT EXISTS idx_emprestimo_abertos ON emprestimo("idAluno") WHERE "dataHoraSaida" IS NULL;
CREATE INDEX IF NOT EXISTS idx_orientacao_aluno_laboratorio ON orientacao("idAluno", "idLaboratorio");
CREATE INDEX IF NOT EXISTS idx_evento_laboratorio_data ON evento("idLaboratorio", data);
CREATE INDEX IF NOT EXISTS idx_horario_laboratorio ON horario("idLaboratorio");
CREATE OR REPLACE FUNCTION fn_capitalize_nome(txt TEXT) RETURNS TEXT AS $$ DECLARE parte TEXT; resultado TEXT = ''; BEGIN IF txt IS NULL THEN RETURN NULL; END IF; FOR parte IN SELECT unnest(regexp_split_to_array(lower(trim(txt)), '\\s+')) LOOP resultado := resultado || upper(left(parte,1)) || substr(parte,2) || ' '; END LOOP; RETURN trim(resultado); END; $$ LANGUAGE plpgsql IMMUTABLE;
CREATE OR REPLACE FUNCTION fn_email_padrao(ra_in TEXT) RETURNS TEXT AS $$ BEGIN IF ra_in IS NULL THEN RETURN NULL; END IF; RETURN ra_in || '@uepg.br'; END; $$ LANGUAGE plpgsql IMMUTABLE;
CREATE OR REPLACE FUNCTION fn_md5(texto TEXT) RETURNS TEXT AS $$ BEGIN IF texto IS NULL THEN RETURN NULL; END IF; RETURN md5(texto); END; $$ LANGUAGE plpgsql IMMUTABLE;
CREATE OR REPLACE FUNCTION fn_telefone_limpo(tel TEXT) RETURNS TEXT AS $$ DECLARE limpo TEXT; BEGIN IF tel IS NULL THEN RETURN NULL; END IF; limpo := regexp_replace(tel, '[^0-9]', '', 'g'); IF limpo = '' THEN RETURN NULL; END IF; RETURN limpo; END; $$ LANGUAGE plpgsql IMMUTABLE;
CREATE OR REPLACE FUNCTION trg_aluno_before_biud() RETURNS TRIGGER AS $$ BEGIN IF NEW.nome IS NOT NULL THEN NEW.nome := fn_capitalize_nome(NEW.nome); END IF; IF NEW.telefone IS NOT NULL THEN NEW.telefone := fn_telefone_limpo(NEW.telefone); END IF; IF (NEW.email IS NULL OR trim(NEW.email) = '') THEN NEW.email := fn_email_padrao(NEW.ra); END IF; IF NEW.senha IS NOT NULL AND NEW.senha <> '' AND NEW.senha !~ '^[0-9a-fA-F]{32}$' THEN NEW.senha := fn_md5(NEW.senha); END IF; RETURN NEW; END; $$ LANGUAGE plpgsql;
DROP TRIGGER IF EXISTS biud_aluno_normaliza ON aluno;
CREATE TRIGGER biud_aluno_normaliza BEFORE INSERT OR UPDATE ON aluno FOR EACH ROW EXECUTE FUNCTION trg_aluno_before_biud();
CREATE OR REPLACE FUNCTION trg_usuario_before_biud() RETURNS TRIGGER AS $$ BEGIN IF NEW.nome IS NOT NULL THEN NEW.nome := fn_capitalize_nome(NEW.nome); END IF; IF NEW.senha IS NOT NULL AND NEW.senha <> '' AND NEW.senha !~ '^[0-9a-fA-F]{32}$' THEN NEW.senha := fn_md5(NEW.senha); END IF; RETURN NEW; END; $$ LANGUAGE plpgsql;
DROP TRIGGER IF EXISTS biud_usuario_normaliza ON usuario;
CREATE TRIGGER biud_usuario_normaliza BEFORE INSERT OR UPDATE ON usuario FOR EACH ROW EXECUTE FUNCTION trg_usuario_before_biud();
CREATE OR REPLACE FUNCTION trg_emprestimo_before_ins() RETURNS TRIGGER AS $$ DECLARE v_count INTEGER; v_restrito BOOLEAN; BEGIN IF NEW."idAluno" IS NULL THEN RAISE EXCEPTION 'Aluno obrigatório'; END IF; SELECT COUNT(*) INTO v_count FROM emprestimo e WHERE e."idAluno" = NEW."idAluno" AND e."dataHoraSaida" IS NULL; IF v_count > 0 THEN RAISE EXCEPTION 'Aluno já possui um empréstimo ativo'; END IF; IF NEW."idLaboratorio" IS NOT NULL THEN SELECT restrito INTO v_restrito FROM laboratorio WHERE id = NEW."idLaboratorio"; IF v_restrito IS NOT NULL THEN NEW."posseChave" := v_restrito; END IF; END IF; RETURN NEW; END; $$ LANGUAGE plpgsql;
DROP TRIGGER IF EXISTS bi_emprestimo_validacoes ON emprestimo;
CREATE TRIGGER bi_emprestimo_validacoes BEFORE INSERT ON emprestimo FOR EACH ROW EXECUTE FUNCTION trg_emprestimo_before_ins();
CREATE OR REPLACE FUNCTION trg_emprestimo_before_upd() RETURNS TRIGGER AS $$ BEGIN IF NEW."dataHoraSaida" IS NOT NULL AND OLD."dataHoraSaida" IS NULL THEN IF NEW."dataHoraSaida" <= OLD."dataHoraEntrada" THEN RAISE EXCEPTION 'Data/hora de saída deve ser posterior à entrada'; END IF; IF NEW."idUsuarioSaida" IS NULL THEN RAISE EXCEPTION 'Usuário de saída deve ser informado ao fechar empréstimo'; END IF; END IF; RETURN NEW; END; $$ LANGUAGE plpgsql;
DROP TRIGGER IF EXISTS bu_emprestimo_validacoes ON emprestimo;
CREATE TRIGGER bu_emprestimo_validacoes BEFORE UPDATE ON emprestimo FOR EACH ROW EXECUTE FUNCTION trg_emprestimo_before_upd();
CREATE OR REPLACE FUNCTION trg_orientacao_before_biud() RETURNS TRIGGER AS $$ BEGIN IF NEW."dataFim" <= NEW."dataInicio" THEN RAISE EXCEPTION 'dataFim deve ser posterior à dataInicio'; END IF; RETURN NEW; END; $$ LANGUAGE plpgsql;
DROP TRIGGER IF EXISTS biud_orientacao_validacoes ON orientacao;
CREATE TRIGGER biud_orientacao_validacoes BEFORE INSERT OR UPDATE ON orientacao FOR EACH ROW EXECUTE FUNCTION trg_orientacao_before_biud();
CREATE OR REPLACE FUNCTION trg_registro_before_ins() RETURNS TRIGGER AS $$ BEGIN IF NEW."dataHora" IS NULL THEN NEW."dataHora" := NOW(); END IF; RETURN NEW; END; $$ LANGUAGE plpgsql;
DROP TRIGGER IF EXISTS bi_registro_timestamp ON registro;
CREATE TRIGGER bi_registro_timestamp BEFORE INSERT ON registro FOR EACH ROW EXECUTE FUNCTION trg_registro_before_ins();
INSERT INTO "permissaoUsuario" ("nomePermissao", geral, cadastro, alteracao, relatorio, advertencia, ativo)
VALUES ('ADMIN_GERAL', true, true, true, true, true, true)
ON CONFLICT ("nomePermissao") DO NOTHING;

INSERT INTO usuario (login, senha, nome, ativo, "idPermissao")
SELECT 'sistema', 'deinfo', 'Sistema', true, id FROM "permissaoUsuario" WHERE "nomePermissao" = 'ADMIN_GERAL'
ON CONFLICT (login) DO NOTHING;
COMMIT;
