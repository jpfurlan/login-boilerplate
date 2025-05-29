import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, MatMenuModule, MatButtonModule, MatIconModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  currentLang: string;

  constructor(private translate: TranslateService) {
    translate.addLangs(['pt', 'en']);
    translate.setDefaultLang('pt');

    const rawLang = this.translate.getBrowserLang();
    const browserLang = rawLang && rawLang.match(/pt|en/) ? rawLang : 'pt';
    this.currentLang = browserLang;
    translate.use(browserLang);
  }

  switchLang(lang: string) {
    this.currentLang = lang;
    this.translate.use(lang);
  }
}
