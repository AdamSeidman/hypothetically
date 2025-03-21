const characterAssetsBase64 = {
    Gracie: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAnYAAAJ2AHHoLmtAAAFXElEQVR4nO1bXWgcVRT+xq3p0oWVbNywZBmDKbRpNmraUmM2rQqiLxFarLFVY6PQPpjXEBfy4EMfIlIqQiEvCcYYNZVQaR98EQqtlgSFFrFNXR80tkuWaGSrgV3SzSbXh82dzM+d2fm5s1foflB25s6dc8/33XPOvTOZSoQQPMh4SLQDolETQLQDolETQLQDolETQLQDolETQLQDouFZAEmSiCRJQraTPMbe5tWBzkRcOSaESF7siRhbcvMsQFWnDlD8ML8IM0fczJSVLdbYVveYwXEEsAan6EzETYn2dO+uaLtdjhjGMhvHrM1pNDiKACvyQHkW1ER7kzHMzC6hNxkDAMzMLhnu0ZO2gw/PzzFFUPthVwTbAtglryat/qXYFtjOvL+1KWTLDwpeIngqgk5AiedWCoiEdxiup7N55dipGF7AZR+gn30WSuv3UVq/j3AogNxKwdJeOpvXCMJC6niXUvi8wLYAhBDJ7oB6IXqTMRxMNDr3ziWc1ABHEVBJBP3s9yZjmL66hOmrS/hnpYTSGlBaY9/LCvtKUcCCE/KAixTQi6Cv/BS08gPA6eF+/PR7Dh0t5Yq/o46dBiwRXnnzqKkv+jRwSh5wWQMqRUJBCqMghZXz90cmFREqwW0BdEMe8FAEzUTo6d6lHBekME4P9wMoixAMbleiwApUhOGhE7Z8cUse4LAKdMh1yjElvz/ZpfwDoIgAwDQK9PluNxJSx7sc+asHl33A4t0FxB97XDkfm7ioHJ9654imb0dLxFYqqEHrwNdfXHDtoxk8C7BTjuO3zCIW7y4A3btw49c/NdfHJi5qREhn8ygU15m20tm8YeZHznymOee9SeISAVQEALi3vIwLswsAAEIIjjz3FEY+Oo9gkL0FtgIlf+m7nzX2eIrA7Y3QTjmOy9duadokybouVdoR6lHJnhsIeSXGehagcLr5ObC31ZMvXB+G6qNRAMDJw1GlbfneKrOvlQgUrU0hpLN5HH72ST4OMuApAgghEs33+mgUHbubDH1efKYFb/XsN7Vx9uMPDG12ooDO/KupCdd7AIBTBLDIs8RwgvzqGkLBhz3ZsANuNSDWUA+gTJySjzXUK+280NoUUmbfa/4DnGuAE7LDQyfQEN9jej2TK0KObNUBv1CVVWDqm+uu7svkisivrvn6hkjIMmj3IYfiwN5W30Tw/Z2gfvadkqco53uaS96r4TkCCCHS+KUfbfU1I89aCikyuSKuzN0EYCx6XpdAoAoRYEbaqgACwOBAH86Ofg45Un7cvjJ3E893PcHdv//NX4fNoiCTK/o6LrcIkBPtyMzfqtxxE6/1DRhtPPqI5pxGQXlJrDP05wHfUyBzex5yWwIA8G7qnHXfv/81tFERAKCxeQ/+uvMLV/+4CmAVBU+/PAikzuHG7TsV7exra8ahY0P4/qszSptfqeB7BMhtiTJ5F6AiDA70cfZqC1yKICFE6twkKSfaNdfckqc4dGxIc97YXF49eCyBgM+rwNH3PjG07WtrtryHdV0vAk/4JgCL/PX5PwCYi0DbaT811CLQKOABXwRgkadQi0AJq49Z5Cn8iARX3wiZGit/nmKr7/TkOADgjbdP4ctPxwAAr/eftDsOl/wHBO0EKflrl7/V/NL2aqJqX4hQTE+OK4RHp2ZACDG87rYbCTzAVQBCiGSWBupZH52aof2VX9Y7f5YQPMMfqFIEsGZdD9pW7WjgLoBZFOhnHdCSZUXDwRde0tjgPfsA51VAY3hThI2NDQQCAcVx9cePajKsdrWQfpAHfBQA2CLlxXEeNizt1/7f4AOOmgCiHRCNmgCiHRCNmgCiHRCN/wBWSF00Rqq29gAAAABJRU5ErkJggg==",
    Ozzy: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAnYAAAJ2AHHoLmtAAAClklEQVR4nO2bwW4TMRCG/4HCMaKXNiJYSPsabVVuvAEPwOP1KYrSvsZKlUmVcqBV1AsIaTiAg+U4u971eAcp/k9Juzv+5/PseNerEDPjkPVC24C2KgBtA9qqALQNaKsC0DagrQpA24C2KgBtA9qqALQNaKsCyA1ARExEKs/UEmOLVIAxDaaGQERsTJMdR+wSmBKCVPKAAABmJmtbANNA8JO3tgUzU0480Sa4mM2LQnDJL2ZzsZhHYpH+ajGbA+aP2dzZ8VUieaAAAEAeQqnkgUIAADkIJZMHhAAwMxERw2DHaNgTUmD4x8e6/WqzFmmAQIEKWG3WUQhOKQ2ya4lbbdYZ7nZFUi9GJNfmFElVQH0W0DagLREAU5c/IHfXWStA24C2KoCSwW+vnmBtC2tb3F49lTj3kYiOczxK7Aj9ijXAmOlUCKnnGtMcA/ieFHSPJCrgpUAMNWXfCXYtgeGsffx8iufnH0lxw3PPPr2JHpd7R1gUwBTKBXDwq8DoCvhwcbE9sb27FzM0VM37t9vP18vl4EoQeRr0YQBlgfgJA+OS9jUKgJ/w9XJJYR8ITQLjoPTFcdd/6GfIGNkVkDr7fjLt3T3cVrovY5qd4/piAXlVkFUBbmC/AobMvg9h30rSFc9fAUJPqcqqgDGzHx5nbYuuy6d0FYhuiV2en+/8ve/aDwHEFKuCLzc3/9em6HZnGOicUaAbSkrjc+ONd/tPorvCzpQPYmj37+sXkm+bAMFLIBq8Z3/f2hanJ+/w8O3r3v87SSe+9TjV7wWI6KcxzSv33SXvFEKQ2vbuU7FXY6GY+XXfJuYUMx5qsgqIDj7wlVkRD/UnMweuCkDbgLYqAG0D2qoAtA1oqwLQNqCtCkDbgLYOHsBvE7tk+NyfxwYAAAAASUVORK5CYII=",
    Champ: "data:image/png;base64,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",
    Dusty: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAnYAAAJ2AHHoLmtAAADLElEQVR4nO1au04bQRQ9E1ESIEqkfIFTmBIKp+ELoCBy69CZDyA235BFbiiQ7DK0JEaK/yEUcWkX4WMuBR5rHzPree3cVbxHWml37D1z7tk7d2YfgoiwzXjDLYAbjQHcArjRGMAtgBuNAdwCuNEYwC2AGzscnQohtMtPIhIxtUQxIB9w0m9jMF7g5vJw3SaP8/+t2hDhey+gE5xuT/rtzDmD8WK9f3N5WDAjjeFkWcqdbnfS72OAEILywUnB+XYgG7gOOiPKuIeTpbMJzgboglcFLmFiAFBugq4fVxOcZgGX4IHNgUlsMirptzNDQ7aVFVcdrA1wDd4WsUwwngUkcehAQyNtgsmQMDJAddVjoGx2KIPUKoSgTSZ4rwSrSH9TqIaBLSpbCOXHsMuVlDyu55qgknsBVQEznQJ1fD7nl8EoA4hI2NaB6ai73j+/egDgZkKaxyYbTNcFwYfAYLzAdNTFl28/AQBEhOmouzbBBiqe0EPCawgMJ0vcDU6wu/9hveUhRJh7mTRPur+7wYlXIfTOgLd7+74UrH16G7C79y5z/Hh7gfOrB/xCsQbYQsXzeHtR6NMH/hmgSHvAPehNPLr+XOFsgKyyQgj6+/t75rf5LMHR6dBbXB7zWYKD9x8zbcdn106zlIRxESQiYVNs5rPEWkwoPptb461/KOptABGJ47PrEFqsIdPfh2PrM8CqCMpiI/fL/hu6CB6dDkvrgI22NKxnARW5bjaoEqr0j/ZM8H9CMANiFsMQxU8iaAbEMGHFH0y395shJenrs7gqeIO/Ktv6GsDydhgAvn7+VGj78edffCFEFHx7pdWj12kRgMLW67RKz1vxhtVal+C5TNj6GhDVADnue52W8ndde5Vgy4B8sPI4diGMZoCq6sugLa588MVFFANUwatgcPWDfy9UqyJoalRIBF8K55fBuqDun54LbbqhkM6M0Mvhyg3QvRlSBasyBQDyfLU2AMh+xkarhyUuU9z903PmSY/kCyQTQEUGKDvKBgEgOzxkmqczJnSwSl2xDMh0WqNPZVkMqBNqNQ1yoDGAWwA3GgO4BXCjMYBbADcaA7gFcOMFS2P/ZKn53m8AAAAASUVORK5CYII=",
    Raccoon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAnYAAAJ2AHHoLmtAAADJklEQVR4nO1aYZKzIAx9fLNH8Rh6F3syuUs5Ru+S/bGNH0VQEqLszPpmdqbbGpL3EiIijojwl/GvdwC9cQvQO4DeuAXoHUBv3AL0DqA3bgF6B9AbX1pD59y6hCQiZxPO9XGoBHDO0TzPmyCuFIJ9pnFIY3DSZ4GUfAzv/SUiWMag7gHe+8138zx/lOQZKJHPxVM1nqQC2Pnr9QIAhBAAfJYhB1OTBen8zZFn4uM4AgCGYRBVgboJxk699x8icCWkQaTVkesjjJxtjjzHoEWTAIxxHDciMGJipXmb++2oOizIA0YCAHkR9prVEfaqw4o8YCgA8F8EYD/bUvBY6Xy3QHUTTBtgDiEEU+IlHFWApBGaLYWvIg/8VATfgVphIsCV5BlWIjQL0IM8w0KE6iZIRK6mD8RYlmXz3ePxOM0OkC+EmleCueznCKTIEdLaxU1RKoDpfsCyLFUk+Nq9/y181EAkABE57z2GYdhk3zKoGsT+uBdIsw8YVYCWPNu12regWYCrM2/un4jEfwBonmeygOU4P3SEXKQGRLz7ZQMrAYhIJcCf3xUWC/De6BDZTNOU/Z7v6aVFTsmuBCISb8mZPg6niAnw5+fzeZqdBqdNgVL2jrKqtdNCJEBt+cfBhhDU2Utta0SQTgPzCsgF6dx2YZbO+1IfSG2tK8G0B+SCa9m+KtlO02TWE8wqoDYzR4HXErOqhGoB9ua/FXnpdSW/kj4g2hTNXasln+sL6fgtwjrnzt8Utc681q5lOqgFaJ2Dabalq8sU2niqBEjLX+JsL4s85h55SfXEcdX2AVEPAGS3tZrg33P18DqJ6LxTXNMDVAckgGMhajNXKwBwLIKE+OpfO/f2hJCSbxVBQ5yhXgmyM+ccWb6slCKE0HQsp3klSEQufjtTuien9/0461wFRzbp+K3kgYYpsBmo4kkxJpS79uj39NpW8oChAMDHcTmzMTM+8PZhchrNVIB10BOEsCa+jntytuJzPhr79bM18dXHmQJ8OMqsymLfhYej8w9dXiVA1vkvOG/cVYDfgPvFSO8AeuMWoHcAvXEL0DuA3rgF6B1Ab3wDHV3Hu7E2EukAAAAASUVORK5CYII=",
    DSF: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAnYAAAJ2AHHoLmtAAABoUlEQVR4nO2bMW7DMAxFpaBbps7JWXh43iVzl+7upMA1YlskJX0a4hsTy/r8pkg6QPKyLGlmbmgBaMIAtAA0YQBaAJowAC0AzRdqY2b+N4AQUW5473LP02shGbANfu+zEQw34ChQhAnT14AwAC1gw4uZHyM3HN4FiCjvnXUieo7WA8mATy2vZRuUADsC64BRwafkrwYMJwxAC0gpJWa+o/Zu0gUaTHC/ZX6X0KJ2mAxAze/b/S1GqI8AOvg1Fi0qAzwFX9BqclEEkYgN8Pj0CxptkQFoAWh6vg1+ak21KapeK50nqgxQDCl7fTmn80Asa8VIMuC78rqzoeQoEMtaFRIDflpu7IUogoJr3fb/DUVn1ftBbQZcJfg1VZp7HIGzjY++t6xV0asG7AmtCcCyVkzPQcgieNiRm74LhAGV18F+tzdQpVlSA8oNvbdE0cOa/gj06gK9jsxl5oDL0CsDvNeJN9NngMYAzy1RrC0yQLnOYxaoNFkywJMJai3WLoCeDs0PIcd/hiYnDEALQBMGoAWgCQPQAtCEAWgBaMIAtAA0f6AqZ6th1jffAAAAAElFTkSuQmCC",
    Molly: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAnYAAAJ2AHHoLmtAAAC80lEQVR4nO1bsW7bMBA9GkFaId1aoIALBJ06pmuQpUOW9Cv8bf6FTF66Gp31CR4EdMoSQDbQgh1sGhRNUjzyjhdAeotliSLvnt4dj7SstNYwZSykDZDGTIC0AdKYCZA2QBozAdIGSGMmQNoAaUyegKtaAymlfDX3QmutlVILAPjnud5orfesdlGuBWwntdbKPvd0t7xov2m783HsutuXfa4UJArwORlz3ODHt4/Rfs29sf5LiShSQMjJTdtFHbfR7w/QvH+X1NbXr6sSLLIIGJN1qvMAOAJi/ecSgSZAKaVDDmKdB8ATMDbOpu1QJKCmQWrnc/F0txwkUPdaYMbxIpmAmPNvDRgSSAqhmk/fIKYCDJIIoHj6/f4A/f5A3jaEVBVMvhQeJYAq9rGZHtvehxQVsK4FrLkZfn7/kuyUaefezwGWEHDjV6nwtPz1081of+b+0rzgw+RzAGsIlOaOGlMrGwG2XEsSGofsbZCEgFuU2A6XZvNQX1TFF5sCKKYxjr5ciCbBzx+uBp8SICOAqjZPAeXag1QBNUigXniRh4Ah4Rp6uIY+2M6VfSwMTF8cq87JF0KjBGitFUbWZkvquX0BAIiqIAXm/uf2JduWWJskBWAHHkNI7pSzQereYHIIUJPACczGKCoHjJGA3ZHNAbUN1ZPgmMxrF0Xo0Y6/ZRLtEDdWH315eOUoMEsBPhmiB2+W8e/c45+QHQI5STFV3tgwKMk9RQFnwsEcJ98YetrNMjkUssd2UJxx0IOfnF//+n1xafV4jyYBNbYHIqWwz/nYeU6wEWCXw6U49cNia1UF/Hn9C9B3R6l7sHq8B+i7YzsHmum9/uohcCbh4XZwfvVwG3SeEyI5wDhpSDCftZ0HECKgxmowFaSvyXkHcMpm4+R6uwOA4TaaTwncCyyR7dj1djfY2jLH6+3uIjdwg50AU7G5jsXKaFsl3Mtr9hA4D5T4lifH26BRu+a/zU0cMwHSBkhjJkDaAGnMBEgbII3JE/Af4DiyrRTosnkAAAAASUVORK5CYII=",
    Unicorn: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAnYAAAJ2AHHoLmtAAAD2ElEQVR4nO1aPVLrMBDefUNSU8Sdb8AMJRNCS8F5OAjn4Agp0sLLUL4ZbuAOilQUUOwr4nXWjiTrZ2UxkK8hWLa0++nT7ko2EhH8ZvwpbUBpnAgobQAiFl2DxQkojRMBJQdHRPrYPRZdBsUV8Pn6UnT84gSURhYCQiQ9v7jK0q8v1AlARCIidWOz9atZCrOR7e/uOhGh6d7d0333//nNg/E+W9+ue0NwptEJQN9Axttdrw359/BZXgbcNuYcK0GDBBUC2Pmv7TsAAMyWCyCiBhHrt7s9Eewck1Ktj9e/JAzgQIQkl8fQIiGJAGFoZ5hADbB3FODgnAnDVDgkwoSv7bsKCdFBEBHJ5RSDFSBRrQE+do/w+frSOb97uu/Icj2rjSgC2PlqbZ59IdNm6BRDzvr84sqaDtsxGtmvHCc1M6gFQQtqV2NADeDsJwXBBPhKfwznNw/G69U6v+wlNBTQQMQM2Zy0LZlcSKoE2/RWz5aLZtiGiFywHMUBjh9j4PXPfQ0xWy6a1KIoSAEm+TMJRNR8bd9rAID5dQWiKKq5JuD7bWgd/oeIlwBd8KtlBfj59w0AOudrrjFiSVAJgpKE9u/wFr7WK44s6/1Skicb2ojfK7JS4U3AWPATJLi66akhBi0JPedTVKC2G5T5egQ1EcEIUU646otQaG+Hg2ZWOhJAYPA4LqgQEGg8wD4WmK57OzZUgdxwhUBTAd7Gi+idEshUVFD0THDKis8GbwKICEMDj62AGcrXtoRsz2si92YIALojLHmplw654Al4Xg2TEGBBbSt4pkRWAlJnLeT5ag2wWYUXREFBMCYOlIJvStTMAiF1QLbxWAX8d6wTFQI4p2v05QtXDbFZ+ffzI94NtmkUb58P126fx98vAEQEQSJCx84w6nQoAsZx2Db+7dORmgKmXAaIWG9W5lMlIsJsWcATuYOhav+qBEyggoZn3zBuVNERRcBYPdDW7+pKMDlvuCeIiCxZoM3Bqkrg018Z6WUcYBWEqiG6FB7JBgxrVjC8TIXZchFrDgDEba+z7QVYBbKeNzktIdslGfLsn4nfrA65Xk4E1wS+diYR4KkCABh33nS/ryJi8j9jkkow1PmY50LzPyNaAaZtJ29JAfry5Lc5keMczSr3q/GJTNL3AVpvimOg9ZFU8stRhmlDYsL8uoL5dRXclgtRSyAk8g6XgWs5DNval6xZT0WT6wD+Ldt8t6LfAaofSgLYz+RCg+EUsw+QgQDnYIMSVRIyXPtTKWhSAo4GF4SUWjJFCfgO+BFngik4EVDagNI4EVDagNI4EVDagNL49QT8Bwb/cnFKGIbpAAAAAElFTkSuQmCC",
};

const backgroundAssetsBase64 = {
    Red: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAnYAAAJ2AHHoLmtAAABwElEQVR4nO2bS5LCMAxE2xTnmpw9czGxANUYTT6WY0f+6K2AqoD6uZMsiAMRYWaeAPAbQvUfWgCV6RWoPtQP0VtADWTg9frxVYQUF8CDawNL5PHR9xYVUUxAqeB78PeWFnFZQO3gktIisgXcHVxSSkSWgAUgq+CSWESOhIf2gJbCx6zQ32oBpYBWwzM5EpIFtB6e0UpIEtBLeEYj4VRAb+GZVAmHAnoNz6RI2BXQe3jmTIL6NjgamwJGWX3mqAXeAPnBaKvP7LXAGxC/GXX1ma0WeAP4xeirz8gWeAOsB7BmegGBiBBCmOL8j1kAEFGYvgEuwHoAa1yA9QDWuADrAaxxAdYDWOMCrAew5gG8/1tfrCe5kQV/zxN4A6wHsMYF8ItZrgPx+Q94A74FjN4CufqAN+C/gFFbsLX6gDdgW8BoLdhbfcAbsC9glBYcrT5w0oDeJZyFBxJOgV4lpIQHEq8BvUlIDQ8oLoK9SNCEB5R3gdYlaMMDGbfBViXkhAcyd4x8JJhumWF4MW7dMhP/oJWIq8GZy7vG7hZRKjhTbN9gbRGlgzPFd45KEdHnKuSFtputs4wcuMXN08DnIamZeQEZLIjcrXlNNwAAAABJRU5ErkJggg==",
    Orange: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAnYAAAJ2AHHoLmtAAAB1klEQVR4nO2bS3KDMBBEW66QK4S7kmW4K7lCWMgLe1KKAkYjJEafeSvbVeDppwYWtoy1Fj3zBgDfn+/Zv2icV5bpZRpMrlmIj6+fh4Ac+IGXaTh7fBYhyQXQ4NzAPv7xznmTikgmIFXwPei8qUWcFpA7uE9qEdECrg7uk0pElIBxXq1UcB9XRIyEG/eAksK7LNPAftQCTAGlhidiJAQLKD08wZUQJKCW8ARHwqGA2sIToRJeCqg1PBEiYVdA7eGJIwnsx2BrbApoZfWJVy3QBvgftLb6xF4LtAHum1ZXn9hqgTaAXrS++oTfAm2A9ADSdC/AWGthjOni+ncZ5xXWWtN9A1SA9ADSqADpAaRRAdIDSKMCpAeQRgVIDyDNDXj8tj7Oq/QslzHO6+//CbQB0gNIowLoRS/3Aff6B7QBfwW03gJ/9QFtwH8BrbZga/UBbcC2gNZasLf6gDZgX0ArLXi1+sBBA2qXcBQeCLgEapUQEh4IvAfUJiE0PMC4CdYigRMeYD4FSpfADQ9EPAZLlRATHojcMfKUILplhqDFuHTLjPuFUiLOBidO7xq7WkSq4ESyfYO5RaQOTiTfOeqLcD5nnce/0VazdZbwBy5x8zTw/JNUz9wB+MEeGEUZzDsAAAAASUVORK5CYII=",
    Yellow: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAnYAAAJ2AHHoLmtAAAB2ElEQVR4nO2bS3KDMBBEW67cIGydI4T7H4McIWzxGZSFPSlF4aMREqPPvJXtKvD0UwMLW8Zai555A4DH10f2LxrGmWV6me4m1yzE++f3U0AO/MDLdD97fBYhyQXQ4NzAPv7xznmTikgmIFXwLei8qUWcFpA7uE9qEdECrg7uk0pElIBhnK1UcB9XRIyEG/eAksK7LNOd/agFmAJKDU/ESAgWUHp4gishSEAt4QmOhEMBtYUnQiXsCqg1PBEiYVNA7eGJIwnsx2BrrApoZfWJvRZoA/wPWlt9YqsF2gD3TaurT6y1QBtAL1pffcJvgTZAegBpuhdgrLUwxnRx/bsM4wxrrem+ASpAegBpVID0ANKoAOkBpFEB0gNIowKkB5DmBjx/Wx/GWXqWyxjG+ff/BNoA6QGkUQH0opf7gHv9A9qAvwJab4G/+oA24L+AVluwtvqANmBdQGst2Fp9QBuwLaCVFuytPnDQgNolHIUHAi6BWiWEhAcC7wG1SQgNDzBugrVI4IQHmE+B0iVwwwMRj8FSJcSEByJ3jLwkiG6ZIWgxLt0y436hlIizwYnTu8auFpEqOJFs32BuEamDE8l3jvoinM9Z5/FvtNVsnSX8gUvcPA28/iTVMz8DliL+Zx6GNAAAAABJRU5ErkJggg==",
    Green: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAnYAAAJ2AHHoLmtAAAB1klEQVR4nO2bS3KDMBBEW64chZR9rnAucq5Q4S7Kwp6UovDRCInRZ97KdhV4+qmBhS1jrUXPvAHA++cj+xct48wyPUx3k2sW4vvj6ykgB37gYbqfPT6LkOQCaHBuYB//eOe8SUUkE5Aq+BZ03tQiTgvIHdwntYhoAVcH90klIkrAMs5WKriPKyJGwo17QEnhXYbpzn7UAkwBpYYnYiQECyg9PMGVECSglvAER8KhgNrCE6ESdgXUGp4IkbApoPbwxJEE9mOwNVYFtLL6xF4LtAH+B62tPrHVAm2A+6bV1SfWWqANoBetrz7ht0AbID2ANN0LMNZaGGO6uP5dlnGGtdZ03wAVID2ANCpAegBpVID0ANKoAOkBpFEB0gNIcwOev60v4yw9y2Us4/z7fwJtgPQA0qgAetHLfcC9/gFtwF8BrbfAX31AG/BfQKstWFt9QBuwLqC1FmytPqAN2BbQSgv2Vh84aEDtEo7CAwGXQK0SQsIDgfeA2iSEhgcYN8FaJHDCA8ynQOkSuOGBiMdgqRJiwgORO0ZeEkS3zBC0GJdumXG/UErE2eDE6V1jV4tIFZxItm8wt4jUwYnkO0d9Ec7nrPP4N9pqts4S/sAlbp4GXn+S6pkfcY4YmJak81QAAAAASUVORK5CYII=",
    Blue: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAnYAAAJ2AHHoLmtAAABy0lEQVR4nO2bS3KEMAxE26mcKxyFHC0chVzMWRAxROFjGRv5o7eamaoB9XMDG+y89+iZdwBwn9/5zzQNMtPj7DJNsuK/PhYBWeCBx/nu/7MISS+ABpcG5vD/v46bVEQ6AamCH0HHTSzivoDcwTmJRcQLeDo4J5GIOAHT4NWCc7YiIiS8iU9YUvgt4yx/1EIqoNTwRISEcAGlhyeEEsIE1BKeEEi4FlBbeCJQwrmAWsMTARKOBdQenriQIH8MNsa+gFZWnzhpgTXg3y+trT5x0AJrwJ9vra4+sdMCa8D6qfXVJ1gLrAHaA2jTvQDnvYdzro/rf8s0wHvvum+ACdAeQBsToD2ANiZAewBtTID2ANqYAO0BtFkEjLPDNCiP8iDTsL5PYA3QHkAbE7B+6uU+sLn+AWsAE9B6C9jqA9aAHQGttmBn9QFrwIGA1lpwsPqANeBEQCstOFl94KoBtUu4CA+EXAK1SggID4TeA2qTEBgekNwEa5EgCA9InwKlSxCGB2Ieg6VKiAgPxO4YWSTobpkhaDEe3TKzPaGWiJvBifu7xp4WkSg4kW7fYG4RiYMT6XeOchGv32XH4TfaarbOEnzgAjdPA78vSfXMD+Fc0/H9rVo+AAAAAElFTkSuQmCC",
    Purple: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAnYAAAJ2AHHoLmtAAAB2ElEQVR4nO2b23GDMBBFrzypIRTjFEQqCgWFYnATyoe9GUXhoRUSq8eeL9sz4L1HF/iwZay16Jk3APj8eGT/omkeWKbH+2JyzUJ8fb8/BeTADzzel7PHZxGSXAANzg3s4x/vnDepiGQCUgXfgs6bWsRpAbmD+6QWES3g6uA+qURECZjmwUoF93FFxEi4cQ8oKbzLeF/Yj1qAKaDU8ESMhGABpYcnuBKCBNQSnuBIOBRQW3giVMKugFrDEyESNgXUHp44ksB+DLbGqoBWVp/Ya4E2wP+gtdUntlqgDXDftLr6xFoLtAH0ovXVJ/wWaAOkB5CmewHGWgtjTBfXv8s0D7DWmu4boAKkB5BGBUgPII0KkB5AGhUgPYA0KkB6AGluwPO39WkepGe5jGkefv9PoA2QHkAaFUAverkPuNc/oA34K6D1FvirD2gD/gtotQVrqw9oA9YFtNaCrdUHtAHbAlppwd7qAwcNqF3CUXgg4BKoVUJIeCDwHlCbhNDwAOMmWIsETniA+RQoXQI3PBDxGCxVQkx4IHLHyEuC6JYZghbj0i0z7hdKiTgbnDi9a+xqEamCE8n2DeYWkTo4kXznqC/C+Zx1Hv9GW83WWcIfuMTN08DrT1I98wPEuB+kjMPVYgAAAABJRU5ErkJggg==",
    Pink: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAnYAAAJ2AHHoLmtAAAB2ElEQVR4nO2b23GDMBBFrzwpIHQQmiI1hqZIB3YHyoe9GUXhoRUSq8eeL9sz4L1HF/iwZay16Jk3AHh8fmf/omEeWabv02JyzUK8f308BeTAD3yflrPHZxGSXAANzg3s4x/vnDepiGQCUgXfgs6bWsRpAbmD+6QWES3g6uA+qURECRjm0UoF93FFxEi4cQ8oKbzLfVrYj1qAKaDU8ESMhGABpYcnuBKCBNQSnuBIOBRQW3giVMKugFrDEyESNgXUHp44ksB+DLbGqoBWVp/Ya4E2wP+gtdUntlqgDXDftLr6xFoLtAH0ovXVJ/wWaAOkB5CmewHGWgtjTBfXv8swj7DWmu4boAKkB5BGBUgPII0KkB5AGhUgPYA0KkB6AGluwPO39WEepWe5jGEef/9PoA2QHkAaFUAverkPuNc/oA34K6D1FvirD2gD/gtotQVrqw9oA9YFtNaCrdUHtAHbAlppwd7qAwcNqF3CUXgg4BKoVUJIeCDwHlCbhNDwAOMmWIsETniA+RQoXQI3PBDxGCxVQkx4IHLHyEuC6JYZghbj0i0z7hdKiTgbnDi9a+xqEamCE8n2DeYWkTo4kXznqC/C+Zx1Hv9GW83WWcIfuMTN08DrT1I98wMv1SYse4vl9gAAAABJRU5ErkJggg==",
};

const unknownAssetBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAnYAAAJ2AHHoLmtAAACHUlEQVR4nO2bXXLDIAyERadn5VBc1nloyTgOf0JaYTD71GRi0H4sxMHUHcdBT9YvEVEIwaIvLmkHqeIk7/0fAJCk0bpeDwGCAFA07r0vXlxIY2xXFYQmgKzxmuncZzMwVEFoAFAxXroeCeJHcO1BQPOMtop11NQLQDTPe9TQZheEHgDm5hltsyFwAQwzz+iDBYEDYLh5Rl/NEFoBzHi/3FRzC4BqQ5ajz+yzWnsNwIwjf1XRQwnACuajsl4kN0JENCb+mn3nAKw0+lFJT+IEzK4UgBVHP+rL207A5fXKox/14XEn4PT3E0Y/6u1VnACjHWVY33sKjC5gtCIA0fwfMQ0U+jyIdgL0AFimQLMv1QRYQNDuQ30KICEg2oasAYhCUWBhi6BmwchUIR+Pvwvv3bmxWFOgAKLORgSPxyEyAXDWyN8OKZkDIMqnYAQcEwCta8D1c5ZrgCPAfgD4gIRUjgiUAO1nBUgQ6vcBg88HsKUK4CbnA1g6AxAdNrrZ+YCa3l73fsDldVcKbnw+IKUPjzsBifdYKZjs8fiXt52AzPvwo+oDlPQkSsDI+GvVUAKwUgqyXmoJWAFC0UPLFJgZQrX21jVgRghNNXMWwZkgNNfK/RaYAQKrxp6vwTtDYNfWex9wRwhdNUluhFwIYTiI/xq66xDvCUYI3nvTQ1Za8NU2Ra1AaKdOfVcYBQI13WAPRq4Fc4FYrS/u6f8+/wJqjKsoyW2fkQAAAABJRU5ErkJggg==";
const transparentAssetBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAnYAAAJ2AHHoLmtAAAAlUlEQVR4nO3QQREAIAzAMMC/501GHjQKer0zc372dIDWAB2gNUAHaA3QAVoDdIDWAB2gNUAHaA3QAVoDdIDWAB2gNUAHaA3QAVoDdIDWAB2gNUAHaA3QAVoDdIDWAB2gNUAHaA3QAVoDdIDWAB2gNUAHaA3QAVoDdIDWAB2gNUAHaA3QAVoDdIDWAB2gNUAHaA3QAdoCVbYDfdVsQBUAAAAASUVORK5CYII=";
const selectedAssetBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAnYAAAJ2AHHoLmtAAACX0lEQVR4nOWbXXbCIBBGPzxdqy7DuIx2s/ShnR5FE+YXhvq9moS5FxIxQqm14p3zAQDbtoU3dLvdPiXHX6/XS1QtlG3bfgRERArcOz9KiLsAK3jvut4i3AREge+14yXCLGAU+F67VhFqAbPA21hFnCyNZoq2JrGAjPAUTW0iAZnhKdIa2QJWgKdIamUJWAmewq25K2BFeAqn9kMBK8NTegy7Av4DPOWIRTUPyJJa69l6jZcCVuh9gudK2GNacgS00JaR8CQge+/vwXIkvGJbagT0IDUj4UFA5t7nwvWOaxmXGAHSnpUc/ycga+9rhnUp5evo83vW1CMgAr5NWgEj4IGkAkbBA0CptaKUIr7/a61nbaO960rP0dZRa72oRoB0Giq9riTWThAL8JyGWq/jMQJFAizTUM11j+J1+7EFRExDted5PntYArymodbjAV94gCEgCioDPMAQoGk04naJgAeYt4CnhEzwgOAh6CEhGzwg/Bq0SMgIDygmQhHPBK92NDkB8v/Wo4sbAU/M6l+DUUWO6nmK6eewd7Gj4QGH9wFeRc+AB+4EWBYbWYsfDX/P6vZGSP1GZlLPUx4EWJecSWFmwLeM7u8EuVCze57yJMBjBWYPbhb8K7awt8J7kFl6nvJSgNc63BZ2JvweU/j/AgSdrecpuwI8l6XPhj9iORwBI3ZtRKfH0L0FVpbAqZ31DFhRArdm9kNwJQmSWkXfAitIkNYo/hrMLEFTm2oekFGCtib1niFqcPbaommbptoCRotIs22OMkpE2o2TlCgRy2ydpbQFZ9w8DfwuknrnfAO8NGz/2jeWxgAAAABJRU5ErkJggg==";
const eliminatedAssetBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAnYAAAJ2AHHoLmtAAACTElEQVR4nO2bXZbCIAyFg8e1TpfRuoyZzWZejEdrgYT8ANr7qpbcjwulWBIiwjfrGtVQSulX8n1EXCTf37ZNVA/9xg2A1HDt91IgXJkD0BqvXdcahBkAL+O5dqxAqAFEGc+1qwVx0RTQy7xlHU0ARjC+1+12a6pJDGBE86QWCCIAI5snSSGwAcxgniSBwAIwk3kSF0IVwIzmSRwIRQAzmyfVIGQBfIJ5UgmCaiWIiD+5z1JKf5prR7V1mABu75caLhUslYX5XAqal8KcAiwgeKfsDcAnjf29jlKgTgCAXwoi5pgXAJret4bgZX6fApMEkKwgRN5dHgCsxr4WQoT55xSYJoDUCiGy50kuAGaSGwBpCnr0PgBAQkTXez/HWC/ziLi4D4FaEnqZJ4XMAS1GIswDnJNgHABJj0b1PkBwAjjGIs0DnEMgFoB2KeyhMABWD0PWOodARCPW+wGWcgdQW+lFbazmdLk35PL+DXeZ2wPCuq4LgGMCpGv8Xkk4J0GPi7Y+4fVIwQOA1TygfbyNgEDjH8A4AVbP9pFJeAGgSYH1xoYXhOfeBzBKgNeuTkQS3gB4rQlG0L73AQwS4L2n552CQwDcFERtaFpAOOp9AOUbIpG7N+H/DH3SXJDrfYD7HyOl0xat7+COopL5bdvqk2DpAqOLUzvrLjAjBG7N7NvgTBAktYrWATNAkNYoXgiNDKGltqaV4IgQWmtqXghRg71vk9rOUJ8a6wXCKoVm5wajQFgPP/OTo14gvOYdt7PD+4KlQKIm2vTtx+f/AU1gaSa38picAAAAAElFTkSuQmCC";

if (typeof require !== 'undefined') {
    module.exports = {
        characterAssetsBase64,
        backgroundAssetsBase64,
        unknownAssetBase64,
        transparentAssetBase64,
        selectedAssetBase64,
        eliminatedAssetBase64
    };
}
