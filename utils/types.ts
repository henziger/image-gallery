export interface ImageProps {
  id: number;
  height: number;
  width: number;
  url: string;
  blurDataUrl: string;
  title?: string;
  description?: string;
}

export interface SharedModalProps {
  index: number;
  images?: ImageProps[];
  currentPhoto?: ImageProps;
  changePhotoId: (newVal: number) => void;
  closeModal: () => void;
  navigation: boolean;
  direction?: number;
}
