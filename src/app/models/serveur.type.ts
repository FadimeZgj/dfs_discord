export declare type Serveur = {
  _id: string;
  nom: string;
  description: string;
  urlLogo: string;
  public: boolean;
  salons: [
    {
      nom: string,
      messages:[
        {
          utilisateur: string;
          contenu: string
        }
      ]
      "public": boolean
    }
  ];
};
