---
layout: post
title:  "GNN: Graph Neural Network"
date:   2020-09-14 14:00:00 -0300
categories: Graphs
description: Generalização combinatória e raciocínio relacional, duas capacidades que precisam ser levandas em consideração caso desejamos que IAs performarem melhor que os humanos.
author: João Oliveira
timeRead: 10 min read.

tags: GNN graphs
js_bundle: true

image:
  path: /assets/images/post-GNN_Graph_Neural_Network-926x521.png
  height: 521
  width: 926
  
thumb:
  path: /assets/images/post-GNN_Graph_Neural_Network-701x394.png
  height: 394
  width: 701

listpost:
  path: /assets/images/post-GNN_Graph_Neural_Network-339x226.png
  height: 339
  width: 226
---

A Inteligência Artificial (IA) dentre as tecnologias disruptivas é maior delas e as redes neurais tem sua parcela de importância, porém, nesse artigo vamos falar um pouco sobre "Graph Neural Network" ou Redes Neurais baseada em grafos, que tem mostrado muito potêncial em pesquisas recentes.

Ao final deste artigo você conhecerá sobre:

• Projeção e importâncias das Redes Neurais baseada em grafos
• Um pouco sobre as Redes Convolucionais de grafos
• Como criar um classificador de vértices com a biblioteca DGL

> Por que grafos?

Me surpreende que atualmente não utilizamos as esturturas baseada em grafos como mais frequência que uitlizamos os dados estruturados ou semi-estruturados. Talvez o viés dos bancos de dados relacionaos ainda influenciem no pensamento das representações tabulares.

As redes podem ter uma aparência a princípio estranha e meio difícil de interpretar, no entanto, entre nós e arestas as infomações podem estar bem mais explcítias do que imaginamos. Disto isto, a principal questão é: os humanos podem se beneficiar utilzando informações de estrutura baseadas em grafos, poderiam as máquinas também?

Estamos falando de uma área "nova" a pesquisa em GNN está no trend topics de assuntos relacionados a IA. A imagem a seguir demonstra a timeline da evolução das pesqusias das redes neurais com um pequeno viés da Microsot, por Alex Gaunt, pesquisador da Microsoft.

![Fonte:](../../assets/images/post-GNN_Graph_Neural_Network-1.png)
<center>
<a href="https://youtu.be/cWIeTMklzNg?t=621" target="_blank">Fonte: Alex Gaunt Presentation</a>
</center>
&nbsp;
O que mais chama atenção nessa área é que as GNNs não precisam de uma alteração profunda em sua estrutura duarante o processo de treinamento. Em um [artigo](https://arxiv.org/pdf/1806.01261.pdf) recente publicado por pesquisadores da DeepMind, GoogleBrain, MIT e University of Edinburgh os autores argumentam que as GNNs podem realizar generalização combinatória e raciocínio relacional, duas capacidades que precisam ser levandas em consideração caso haja o desejo de que as IAs performarem igual ou até melhor que os seres humanos.

Para deixar essa leitura mais interessante vamos introduzir um experimento prático no qual o grafo é baseado no problema do `“clube de karatê de Zachary”`. O grafo contêm 34 membros e arestas de pares entre membros que interagem fora do clube. Dividiremos o grafo em duas comunidades, a primeira, o instrutor (nó 0), a segunda, o presidente do clube (nó 33). Caso não tenha essas libs instaladas em seu computador intale, se prefeir use o comando `python3 -m venv <"path">` para criar um ambiente virtual python, recomendo utilizar um jupyter notebook de sua preferência.

Pré-requisitos:

{% highlight shell %}
!pip install dgl
!pip3 install torch torchdivision
!pip install numpy
!pip install networkx
!pip install matplotlib
{% endhighlight %}

Importaremos algumas bibliotecas e também o grafo do karaté club que ja vem junto do pacote do networkX.

{% highlight python %}
import dgl
import numpy as np
import networkx as nx

def build_karate_club_graph():
    G = nx.karate_club_graph()
    return G

G = build_karate_club_graph()

print('Total Nodes {}'.format(G.number_of_nodes()))
print('Total Arestas {}'.format(G.number_of_edges()))
{% endhighlight %}

<center><img src='../../assets/images/post-GNN_Graph_Neural_Network-2.png'></center>
&nbsp;
Agora, vamos visualizar nosso grafo. O interessante de trabalhar com a biblioteca DGL é que você pode converter algumas estruturas para um grafo DGL, até mesmo um grafo NetworkX que é uma biblioteca bastante conhecida para manipulação e visualização de grafos. Vamos também utilizar o Kamada kawaii algoritmo para formatação do layout do nosso grafo.

{% highlight python %}
%matplotlib inline
#Convertendo o layout do grafo para Kamada-kawaii
pos = nx.kamada_kawai_layout(G)
nx.draw(G, with_labels=True, node_color=[[.8, .8, .8]]) #plot
{% endhighlight %}
<center><img src='../../assets/images/post-GNN_Graph_Neural_Network-3.png'></center>
<center>
<a href="https://docs.dgl.ai/en/0.4.x/tutorials/basics/1_first.html" target="_blank">Fonte: DGL</a>
</center>
&nbsp;
> Node Embeedings

Agora que já temos nosso grafo com todos os vértices e arestas, iremos dar início a etapa de vetorização das característica dos vértices. Conhecidas como GCNs (Graph Convolutional Networks - Redes Convolucionais de grafos) Cada nó possui um conjunto de recursos que o definem. A exemplo, no caso de grafos de rodovias, podem ser cidade, localidade, país e assim por diante. Cada aresta pode conectar nós que possuem características semelhantes ou que demonstre algum tipo de relacionamento entre eles.

A principal ideia aqui é fazer com que cada nó conheça seus vizinhos. Esse processo ocorre através de um paradigma de passagem de "mensagens" que são agregradas a cada nó. A função de agregração também agregará o própio nó do vértice para que a representação seja espacial e mais abrangente.

<center><img src='../../assets/images/post-GNN_Graph_Neural_Network-6.png'></center>
<center>
<a href="https://towardsdatascience.com/a-gentle-introduction-to-graph-neural-network-basics-deepwalk-and-graphsage-db5d540d50b3" target="_blank">Medium</a>
</center>
&nbsp;

Semelhante ao que acontece com CNNs (Convolutional Neural Networks - Redes Neurais Convolucionais) durante a etapa de convolução em GCNs é praticamente a mesma operação. Nesta etapa mutiplica-se os neurônios de entrada com um conjunto de pesos conhecidos como *kernels* ou filtros. Os Filtros deslizam como janelas fluantes na imagem fazendo com que as CNNs aprenda recursos de células vizinhas. Os GCNs realizam operações semelhantes, onde o modelo aprende os recursos inspecionando os nós vizinhos e trabalham com esturturas irregulares e não euclidianas.

<center><img src='../../assets/images/post-GNN_Graph_Neural_Network-4.jpg'></center>
<center>
<a href="https://zhuanlan.zhihu.com/p/51990489" target="_blank">Fonte: Zhuanlan</a>
</center>
&nbsp;

A ideia é fazer com que o vértice aprenda os recursos dos nós viznhos e após conhecer os vizinhos próximos ele possa expandir e conhecer os vizinhos mais distantes.
<center><img src='../../assets/images/post-GNN_Graph_Neural_Network-5.gif'></center>
<center>
<a href="https://youtu.be/zCEYiCxrL_0?t=1336" target="_blank">Fonte: Miltos Allamanis</a>
</center>
&nbsp;

O que são essas mensagens passadas e agregradas a função? são os embeddings dos vértices ou suas características propriamente dito. Vamos codificar essa etapa? utilizaremos embeddings pré-treinados e adicionaremos ao atributos dos vértices utilizando a biblioteca pytorch.

{% highlight python %}
# O código abaixo adiciona os embeddings que podem ser aprendidos para todos os vértices:
import torch
import torch.nn as nn
import torch.nn.functional as F

#convertendo o grafo NetworkX para DGL
G_dgl = dgl.from_networkx(G)
embed = nn.Embedding(34, 5)  # 34 vértices de dimensão igual a 5
G_dgl.ndata['feat'] = embed.weight

# visualizando nossos embeddings
print(G_dgl.ndata['feat'][2])
{% endhighlight %}

<center><img src='../../assets/images/post-GNN_Graph_Neural_Network-8.png'></center>
&nbsp;


> Criação da Rede Neural

Agora vamos a criação da nossa rede neural. Estaremos construindo uma GCN para classificação dos nós, o modelo utilizado foi desenvolvido por Kipf and Welling em seu artigo [Semi-Supervised Classification with Graph Convolutional Networks](https://arxiv.org/abs/1609.02907). Nesse tutorial não utilizarei fórmulas, porém preciso explicar como esse paradigma de passagem de menssagem acontece. A imagem a seguir ilustra como encaixaremos uma rede neural para atuar em um grafo. Cada nó tem suas própias redes neurais que agregão as informação dos seus vizinhos.

Lembra do processo de expansão para conhecer os vizinhos de cada nó? Aqui utilizamos as redes nessas etapas para construirmos o processo de aprendizagem de máquina e generalização das informações. A imagem a seguir ilustra este processo.

A ideia é fazer com que o vértice aprenda os recursos dos nós viznhos e após conhecer os vizinhos próximos ele possa expandir e conhecer os vizinhos mais distantes.
<center><img src='../../assets/images/post-GNN_Graph_Neural_Network-7.png'></center>
<center>
<a href="http://snap.stanford.edu/proj/embeddings-www/files/nrltutorial-part2-gnns.pdf" target="_blank">Fonte: SNAP Stanford</a>
</center>
&nbsp;

Agora vamos inicializar nossa rede neural construiremos uma rede com 2 camadas de tamanho 2 que são equiavalentes aos dois grupos que iremos classificar (instrutor e presidente do clube).

{% highlight python %}
from dgl.nn.pytorch import GraphConv

class GCN(nn.Module):
    def __init__(self, in_feats, hidden_size, num_classes):
        super(GCN, self).__init__()
        self.conv1 = GraphConv(in_feats, hidden_size)
        self.conv2 = GraphConv(hidden_size, num_classes)

    def forward(self, g, inputs):
        h = self.conv1(g, inputs)
        h = torch.relu(h)
        h = self.conv2(g, h)
        return h

net = GCN(5, 5, 2)
{% endhighlight %}

Agora, vamos utilizar algumas variáveis para armazenar os rótulos dos instrutor (vértice 0) e do presidente (vértice 33) e também armazenaremos os rótulos de classificação (amigos do instrutor e amigos do presidente, respectivamente, 0 e 1).

{% highlight python %}
inputs = embed.weight
labeled_nodes = torch.tensor([0, 33])  #label do instrutor e do presidente
labels = torch.tensor([0, 1])  # rótulos para classificação
{% endhighlight %}

Agora vamos ao treinamento da rede, neste caso, não utilizaremos uma partição de treino e validação, faremos ambos em todo o grafo. O Treinamento é bastante semelhante a outros modelos PyTorch, criação de um otimizador, alimentação das entradas do modelo, cálculo da perda e usaremos um autograd para otimizar o modelo.

{% highlight python %}
import itertools

epoch_curve = []
loss_curve = []
epochs = 50
optimizer = torch.optim.Adam(itertools.chain(net.parameters(),\
 embed.parameters()), lr=0.01)
all_logits = []

for epoch in range(epochs):
    logits = net(G_dgl, inputs)
    all_logits.append(logits.detach())
    logp = F.log_softmax(logits, 1)
    loss = F.nll_loss(logp[labeled_nodes], labels)

    optimizer.zero_grad()
    loss.backward()
    optimizer.step()
    
    loss_curve.append(loss.item())
    epoch_curve.append(epoch)
    
    print('Epoch %d | Loss: %.4f' % (epoch, loss.item()))

plt.plot(epoch_curve, loss_curve)
{% endhighlight %}

Ao final desse código será mostrado um plot da curva de perca, ela decaiu bem e se estabilizou entre 20-40 épocas mostrando um desempenho bom do otimizador. Agora vamos dar uma visualizada no grafo na primeira época de treinamento e em seguida iremos animar a visualização para demonstrar a classificação em todas as épocas.

{% highlight python %}
import matplotlib.animation as animation

def draw(i):
    cls1color = '#3590c3'
    cls2color = '#f37c01'
    pos = {}
    colors = []
    for v in range(34):
        pos[v] = all_logits[i][v].numpy()
        cls = pos[v].argmax()
        colors.append(cls1color if cls else cls2color)
    ax.cla()
    ax.axis('off')
    ax.set_title('Epoch: %d' % i)
    nx.draw_networkx(G, pos, node_color=colors,\
                     with_labels=True, node_size=300, ax=ax)

fig = plt.figure(dpi=150)
fig.clf()
ax = fig.subplots()
draw(0)
{% endhighlight %}

Agora, podemos gerar a visualização do treinamento durante as épocas.

{% highlight python %}
ani = animation.FuncAnimation(fig, draw, frames=len(all_logits), interval=100)
ani.save('plot.gif')
{% endhighlight %}

Se voce estiver executando o código em um jupyter notebook pode tentar construir uma célula em markdown e visualizar o gif no notebook com o seguinte trecho. Lembrando que no código acima, salvamos o arquivo `'plot.gif'` em nosso diretório raiz.

{% highlight markdown %}
![](plot.gif)
   :height: 300px
   :width: 400px
   :align: center
{% endhighlight %}

O resultado será algo como:

<center><img src='../../assets/images/post-GNN_Graph_Neural_Network-9.gif'></center>
&nbsp;

Conseguimos separar linearmente os grupos que levam em consideração as características de cada nó(embeddings) e suas relação com os demais nós que fazem parte de um determinado grupo (presidente ou instrutor).

> Conclusão!

  • Diferentemente das CNNs as GCNs trabalham com dados não estruturados sem alterações profundas em sua estrutura, possibilitando tarefas de classificação de nós, predição de link e sistemas de recomendação. Tudo isso trabalhando com estrutura não euclidianas e redes de grafos.

  • A ideia de passar "mensagens" dos vértices vizinhos é interessante pois é possível aprender sobre características dos vizinhos tornando o modelo mais transparente. E o mais legal, os GCNs podem aprender a representação de recursos antes mesmo do treinamento.

Obrigado por ler! Algum comentário ou feedback? Me mande uma mensagem na página de [contato](/contato.html). Você pode me encontrar no [LinkedIn](https://www.linkedin.com/in/joaolso/).
Esse projeto foi baseado em um exemplo da documentação da DGL [GitHub](https://docs.dgl.ai/en/0.4.x/tutorials/basics/1_first.html?highlight=relu).
