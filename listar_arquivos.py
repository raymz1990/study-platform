import os
from pathlib import Path

def listar_arquivos_para_md(pasta_raiz, arquivo_saida="lista_arquivos.md"):
    pasta_raiz = Path(pasta_raiz)
    
    with open(arquivo_saida, "w", encoding="utf-8") as f:
        f.write(f"# Lista de arquivos em: {pasta_raiz}\n\n")
        
        total_arquivos = 0
        
        for pasta_atual, subpastas, arquivos in os.walk(pasta_raiz):
            if not arquivos:
                continue
            
            # Caminho relativo para organizar por seção
            caminho_relativo = os.path.relpath(pasta_atual, pasta_raiz)
            titulo = "." if caminho_relativo == "." else caminho_relativo
            
            f.write(f"## {titulo}\n\n")
            
            for arquivo in sorted(arquivos):
                f.write(f"- {arquivo}\n")
                total_arquivos += 1
            
            f.write("\n")
        
        f.write(f"---\n\n**Total de arquivos:** {total_arquivos}\n")
    
    print(f"Arquivo '{arquivo_saida}' gerado com sucesso! ({total_arquivos} arquivos listados)")

# Uso
if __name__ == "__main__":
    pasta = input("Digite o caminho da pasta: ").strip()
    listar_arquivos_para_md(pasta)