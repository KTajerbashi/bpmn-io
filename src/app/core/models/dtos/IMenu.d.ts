interface IMenuDTO extends IBaseDTO {
  title: string;
  name: string;
  link: string;
  icon: string;
  children: IMenuDTO[];
}
